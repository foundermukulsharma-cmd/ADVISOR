/**
 * Server Authentication and Security Middleware
 * Implements JWT authentication, bcrypt password hashing, brute force lockout, and RBAC.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, StoredAdminUser } from './db';
import { UserRole } from '../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'sarla-hooda-lic-secure-token-secret-2026';
const TOKEN_EXPIRY = '24h';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export function generateToken(user: StoredAdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Express middleware to enforce authentication
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No valid authorization token found.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }

  const admin = db.getAdminById(decoded.id);
  if (!admin) {
    res.status(401).json({ error: 'User no longer exists or permissions revoked.' });
    return;
  }

  req.user = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  };

  next();
}

/**
 * Role-Based Access Control Middleware
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
      return;
    }

    next();
  };
}

/**
 * Handle Admin Login with Rate Limiting & Brute Force Lockout
 */
export async function authenticateAdmin(email: string, passwordPlain: string): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; email: string; name: string; role: UserRole };
  errorMessage?: string;
  locked?: boolean;
}> {
  const admin = db.getAdminByEmail(email);
  if (!admin) {
    return { success: false, errorMessage: 'Invalid email or credentials.' };
  }

  // Check lockout
  const now = Date.now();
  if (admin.lockUntil && admin.lockUntil > now) {
    const minutesLeft = Math.ceil((admin.lockUntil - now) / 60000);
    return {
      success: false,
      locked: true,
      errorMessage: `Account temporarily locked due to multiple failed attempts. Please try again in ${minutesLeft} minutes.`
    };
  }

  // Verify password
  const isMatch = await bcrypt.compare(passwordPlain, admin.passwordHash);

  if (!isMatch) {
    const failedAttempts = (admin.failedAttempts || 0) + 1;
    let lockUntil: number | null = null;
    let errorMsg = `Invalid email or credentials. ${MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining.`;

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      lockUntil = now + LOCKOUT_DURATION_MS;
      errorMsg = 'Account locked for 15 minutes due to 5 consecutive failed attempts.';
    }

    db.updateAdmin(admin.id, {
      failedAttempts,
      lockUntil
    });

    db.logAudit({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'LOGIN_FAILED',
      targetResource: 'Authentication',
      details: `Failed login attempt (${failedAttempts}/${MAX_FAILED_ATTEMPTS})`
    });

    return { success: false, errorMessage: errorMsg };
  }

  // Success: reset failed attempts
  db.updateAdmin(admin.id, {
    failedAttempts: 0,
    lockUntil: null,
    lastLoginAt: new Date().toISOString()
  });

  db.logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: 'LOGIN_SUCCESS',
    targetResource: 'Authentication',
    details: 'Admin user authenticated successfully.'
  });

  const token = generateToken(admin);

  return {
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  };
}
