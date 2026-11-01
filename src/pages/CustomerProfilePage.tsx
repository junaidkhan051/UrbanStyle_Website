import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Package, Heart, 
  Settings, LogOut, Check, ShieldCheck 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export const CustomerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAdmin } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [fullName, setFullName] = useState(user?.fullName || 'Elena Rostova');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 789-0123');
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName, phone });
    setIsSaved(true);
    showToast('Profile updated in demo session');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of demo session');
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
            Account Management
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Welcome, {user?.fullName || 'Guest Client'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Admin Console</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-red-600 border border-neutral-200 px-3 py-2 rounded transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-4">
            <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center font-serif text-xl font-bold text-neutral-800">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">{user?.fullName}</h2>
              <p className="text-xs text-neutral-500">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-mono uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                Member since {user?.joinedDate || '2026'}
              </span>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden text-xs divide-y divide-neutral-100">
            <Link
              to="/orders"
              className="p-4 flex items-center justify-between text-neutral-800 hover:bg-neutral-50 transition-colors font-medium"
            >
              <span className="flex items-center gap-2">
                <Package size={16} className="text-neutral-500" />
                Demo Orders History
              </span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              to="/order-tracking"
              className="p-4 flex items-center justify-between text-neutral-800 hover:bg-neutral-50 transition-colors font-medium"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-neutral-500" />
                Live Demo Package Tracking
              </span>
              <span className="text-neutral-400">→</span>
            </Link>
            <Link
              to="/wishlist"
              className="p-4 flex items-center justify-between text-neutral-800 hover:bg-neutral-50 transition-colors font-medium"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-neutral-500" />
                Saved Wishlist
              </span>
              <span className="text-neutral-400">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Settings and Address Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Details */}
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Personal Information
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Preferred Currency</label>
                  <input
                    type="text"
                    disabled
                    value="USD ($) - United States Dollar"
                    className="w-full border border-neutral-200 p-2.5 rounded bg-neutral-100 text-neutral-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-[#111111] hover:bg-neutral-800 text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Changes
                </button>
                {isSaved && (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs">
                    <Check size={14} />
                    Saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Saved Delivery Addresses */}
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Saved Delivery Addresses
            </h2>

            <div className="p-4 border border-neutral-200 rounded-sm bg-[#FBFBFA] flex items-start justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-900">Primary Residence</strong>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">Default</span>
                </div>
                <p className="text-neutral-600">450 Lexington Ave, Apt 14B</p>
                <p className="text-neutral-600">New York, NY 10017, United States</p>
              </div>

              <span className="text-xs text-neutral-400 font-mono">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
