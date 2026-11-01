import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, UserCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { user, isAdmin, switchDemoRole } = useAuthStore();

  if (dismissed) return null;

  return (
    <aside aria-label="Demo notice" className="bg-[#111111] text-[#F7F5F0] text-xs border-b border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-300">
            Portfolio demonstration. Products, pricing, inventory, and orders are simulated.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-[11px] text-neutral-300">
            <span className="mr-2 text-neutral-400">View as:</span>
            <button
              onClick={() => switchDemoRole('customer')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                !isAdmin ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck size={12} />
              Customer
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                isAdmin ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={12} />
              Admin
            </button>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-[11px] text-amber-300 hover:underline font-medium"
            >
              Go to Admin Dashboard →
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-neutral-500 hover:text-white p-0.5 rounded"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
