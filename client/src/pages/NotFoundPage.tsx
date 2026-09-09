import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-card border border-slate-200 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-crimson-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">403 — Restricted Area</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have the required permissions to access this coordination portal. Please switch
          to an authorized account or return to the landing page.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-card border border-slate-200 space-y-4">
        <h2 className="text-3xl font-black text-crimson-700">404</h2>
        <h3 className="text-base font-bold text-slate-900">Page Not Found</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested coordination link does not exist or has expired.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Safety</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
