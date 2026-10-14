/**
 * Secure Admin Login Form
 * Protects against brute force with server-enforced rate limiting and lockout.
 */

import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { UserRole } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: { id: string; email: string; name: string; role: UserRole }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  // Empty initial fields - credentials must be entered manually by the administrator
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1726] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#10243A] rounded-3xl border border-[#C5A46D]/30 p-8 shadow-2xl relative text-white">
        
        {/* Back Button */}
        <button
          onClick={onBackToSite}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/40 flex items-center justify-center mx-auto mb-4 shadow">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            Advisor Portal Login
          </h2>
          <p className="text-xs text-slate-300">
            Sarla Hooda LIC Consulting & Smart CRM
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="admin_email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="admin_email"
                name="admin_email"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
                placeholder="name@insurance.in"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin_password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="admin_password"
                name="admin_password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent font-mono"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7E47] text-[#10243A] font-bold text-sm rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In to CRM Dashboard</span>
              )}
            </button>
          </div>
        </form>

        {/* Security Reassurance */}
        <div className="mt-8 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by bcrypt password hashing, session tokens & brute-force account lockout.
          </p>
        </div>

      </div>
    </div>
  );
};
