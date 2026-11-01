import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
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
      await register({ fullName, email, phone, password });
      showToast('Account created successfully in demo mode');
      navigate('/profile');
    } catch {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-neutral-200 p-8 sm:p-10 shadow-sm rounded-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
            New Client Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Join UrbanStyle to curate personal wishlists and experience simulated shopping.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="Elena Rostova"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="elena@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Demo Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-neutral-200 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-neutral-300 text-black focus:ring-black"
            />
            <span className="text-neutral-600 text-[11px]">
              I understand this is a portfolio demonstration environment.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agreeTerms}
            className="w-full bg-[#111111] hover:bg-neutral-800 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Demo Account...' : 'Register Account'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center space-y-4 text-xs">
          <p className="text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="text-neutral-900 font-semibold hover:underline">
              Sign In Instead
            </Link>
          </p>

          <div className="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 text-neutral-500 text-[11px] rounded text-left">
            <ShieldAlert size={14} className="shrink-0 text-neutral-400 mt-0.5" />
            <span>
              Simulated registration. Future full-stack architecture will register accounts in PostgreSQL via Spring Boot REST controllers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
