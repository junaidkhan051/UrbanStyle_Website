import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#111111] text-white shadow-2xl rounded-sm border border-neutral-800 animate-in slide-in-from-bottom-5 duration-200`}
        >
          {t.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info size={18} className="text-sky-400 shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs leading-relaxed text-neutral-200">
            {t.message}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-neutral-500 hover:text-white shrink-0 p-0.5"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
