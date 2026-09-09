import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Droplets, Lock, Mail, ArrowRight, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast('Welcome Back', 'Logged in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      showToast('Login Failed', err.message || 'Invalid email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastDemo = async (role: any) => {
    try {
      await switchDemoRole(role);
      showToast('Fast Demo Login', `Logged in as demo ${role}.`, 'info');
      if (role === 'DONOR') navigate('/donor/dashboard');
      else if (role === 'REQUESTER') navigate('/requester/dashboard');
      else if (role === 'HOSPITAL') navigate('/hospital/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err: any) {
      showToast('Error', err.message || 'Demo login failed.', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-card border border-slate-200">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-4">
            <img src="/logo.svg" alt="BloodBridge" className="w-9 h-9" />
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Blood<span className="text-crimson-700">Bridge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Sign in to Coordination Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your donor, hospital, requester, or administrative dashboard
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>Instant Demo Fast-Login</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFastDemo('REQUESTER')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-bold text-slate-800 hover:bg-amber-100 transition text-left"
            >
              ❤️ Requester
            </button>
            <button
              type="button"
              onClick={() => handleFastDemo('DONOR')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-bold text-slate-800 hover:bg-amber-100 transition text-left"
            >
              🩸 Donor (O-)
            </button>
            <button
              type="button"
              onClick={() => handleFastDemo('HOSPITAL')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-bold text-slate-800 hover:bg-amber-100 transition text-left"
            >
              🏥 Hospital Staff
            </button>
            <button
              type="button"
              onClick={() => handleFastDemo('ADMIN')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 font-bold text-slate-800 hover:bg-amber-100 transition text-left"
            >
              🛡️ Chief Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-crimson-700 hover:underline">
            Register for BloodBridge
          </Link>
        </div>
      </div>
    </div>
  );
};
