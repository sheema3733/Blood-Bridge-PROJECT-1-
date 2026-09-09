import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-slate-200 text-slate-800';
        let icon = <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
          icon = <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bgColor = 'bg-red-50 border-red-200 text-red-950 border-l-4 border-l-red-600';
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-50 border-amber-200 text-amber-900';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-modal border flex items-start space-x-3 transition-all transform duration-200 animate-slide-in ${bgColor}`}
          >
            {icon}
            <div className="flex-1 pr-2">
              <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
