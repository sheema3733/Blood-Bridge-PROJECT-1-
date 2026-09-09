import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { UserRole } from '../../types';
import { X, ShieldAlert, Heart, Building2, UserCheck } from 'lucide-react';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { switchDemoRole, user } = useAuth();
  const { showToast } = useNotifications();

  if (!isOpen) return null;

  const handleRoleSelect = async (role: UserRole, label: string) => {
    try {
      await switchDemoRole(role);
      showToast('Switched Demo Session', `Active session changed to ${label}.`, 'info');
      onClose();
    } catch (err: any) {
      showToast('Switch Failed', err.message || 'Could not switch demo user.', 'error');
    }
  };

  const accounts = [
    {
      role: 'REQUESTER' as UserRole,
      title: 'Family Requester',
      name: 'David Chen',
      desc: 'Creates blood requests, tracks real-time 8-step status timeline, verifies donor confirmation.',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      badge: 'REQUESTER',
      color: 'border-red-200 hover:border-red-400 bg-red-50/50',
    },
    {
      role: 'HOSPITAL' as UserRole,
      title: 'Hospital Coordinator',
      name: 'Metro General Hospital',
      desc: 'Review incoming requests in Verification Queue, confirm patient necessity, confirm blood receipt.',
      icon: <Building2 className="w-5 h-5 text-blue-500" />,
      badge: 'HOSPITAL',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50',
    },
    {
      role: 'DONOR' as UserRole,
      title: 'Active Donor (O- Universal)',
      name: 'Marcus Vance (O- Universal)',
      desc: 'Toggle availability, receive instant emergency requests nearby, Accept or Decline with 1 click.',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
      badge: 'DONOR',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Platform Chief Admin',
      name: 'Sarah Jenkins',
      desc: 'Platform Command Center, duplicate request detection triage, user management, audit logs.',
      icon: <ShieldAlert className="w-5 h-5 text-purple-500" />,
      badge: 'ADMIN',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-modal max-w-xl w-full p-6 border border-slate-200 relative animate-scale-up">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>⚡ Fast Demo Role Switcher</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select any pre-configured synthetic role to test real-time multi-agent workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 my-5">
          {accounts.map((acc) => {
            const isCurrent = user?.role === acc.role;
            return (
              <button
                key={acc.role}
                onClick={() => handleRoleSelect(acc.role, acc.title)}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${acc.color} ${
                  isCurrent ? 'ring-2 ring-crimson-600 border-transparent shadow-sm' : ''
                }`}
              >
                <div className="p-2.5 rounded-lg bg-white shadow-sm border border-slate-100 flex-shrink-0">
                  {acc.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm">{acc.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white border border-slate-200 text-slate-600">
                      {isCurrent ? '● Active' : acc.badge}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{acc.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{acc.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
