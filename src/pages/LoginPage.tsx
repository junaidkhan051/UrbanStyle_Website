import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { DEMO_PRESET_USERS } from '../services/AuthService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoRole } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [email, setEmail] = useState('customer@urbanstyle.com');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      showToast(`Welcome back to UrbanStyle`);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch {
      setError('Simulated login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = (role: 'customer' | 'admin') => {
    switchDemoRole(role);
    if (role === 'admin') {
      setEmail(DEMO_PRESET_USERS.admin.email);
      showToast('Logged in as Demo Admin');
      navigate('/admin');
    } else {
      setEmail(DEMO_PRESET_USERS.customer.email);
      showToast('Logged in as Demo Customer');
      navigate('/profile');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm rounded-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
            UrbanStyle Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Sign In
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Access your saved preferences, wishlist, and demo order history.
          </p>
        </div>

        {/* Demo Fast Access Buttons */}
        <div className="mb-6 p-3 bg-[#F8F7F4] border border-neutral-200 rounded text-xs space-y-2">
          <span className="block font-semibold text-neutral-700 text-[11px] uppercase tracking-wider">
            Quick Demo Profiles (One Click):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSelect('customer')}
              className="py-2 px-2.5 bg-white border border-neutral-300 hover:border-black rounded text-[11px] font-medium text-neutral-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck size={14} />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSelect('admin')}
              className="py-2 px-2.5 bg-neutral-900 hover:bg-black text-white rounded text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck size={14} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-neutral-700 font-semibold">Password</label>
              <span className="text-neutral-400 text-[10px]">Demo credentials</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-neutral-800 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center space-y-4 text-xs">
          <p className="text-neutral-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neutral-900 font-semibold hover:underline">
              Create an Account
            </Link>
          </p>

          <div className="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 text-neutral-500 text-[11px] rounded text-left">
            <ShieldAlert size={14} className="shrink-0 text-neutral-400 mt-0.5" />
            <span>
              Frontend portfolio demonstration. Do not enter real credentials. Future releases will connect with Spring Security JWT REST services.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
