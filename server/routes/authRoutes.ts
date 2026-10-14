/**
 * Authentication and Admin Account Routes
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { authenticateAdmin, requireAuth, AuthRequest } from '../auth';

export const authRouter = Router();

/**
 * Admin Login
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const result = await authenticateAdmin(email.trim(), password);

    if (!result.success) {
      res.status(401).json({
        error: result.errorMessage || 'Invalid credentials.',
        locked: result.locked
      });
      return;
    }

    res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server authentication error.' });
  }
});

/**
 * Verify Current Session
 */
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  res.json({
    user: req.user
  });
});

/**
 * Logout
 */
authRouter.post('/logout', requireAuth, (req: AuthRequest, res: Response): void => {
  db.logAudit({
    adminId: req.user!.id,
    adminEmail: req.user!.email,
    action: 'LOGOUT',
    targetResource: 'Authentication',
    details: 'User logged out.'
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Change Admin Password
 */
authRouter.post('/change-password', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    const admin = db.getAdminById(req.user!.id);
    if (!admin) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password does not match.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    db.updateAdmin(admin.id, {
      passwordHash: newHash
    });

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'PASSWORD_CHANGED',
      targetResource: 'AdminSecurity',
      details: 'Admin successfully updated their password.'
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});
