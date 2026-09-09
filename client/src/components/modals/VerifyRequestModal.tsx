import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { X, CheckCircle, XCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface VerifyRequestModalProps {
  isOpen: boolean;
  request: any | null;
  onClose: () => void;
  onVerified: () => void;
}

export const VerifyRequestModal: React.FC<VerifyRequestModalProps> = ({
  isOpen,
  request,
  onClose,
  onVerified,
}) => {
  const { showToast } = useNotifications();
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleDecision = async (status: 'VERIFIED' | 'REJECTED' | 'INFO_REQUESTED') => {
    setIsSubmitting(true);
    try {
      const res = await api.verifyBloodRequest(request.id, status, reviewNotes.trim());
      if (res.success) {
        showToast(
          'Verification Processed',
          `Request status updated to ${status}. Smart matching activated.`,
          status === 'VERIFIED' ? 'success' : 'info'
        );
        onVerified();
        onClose();
      }
    } catch (err: any) {
      showToast('Action Failed', err.message || 'Could not process verification.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 border border-slate-200 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-crimson-700" />
            <h3 className="text-base font-bold text-slate-900">Hospital Medical Verification</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Summary Card */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">{request.id}</span>
            <span className="px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700 uppercase text-[10px]">
              {request.urgency}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">BLOOD GROUP</span>
              <span className="font-bold text-slate-800 text-sm">{request.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">UNITS REQUIRED</span>
              <span className="font-bold text-slate-800 text-sm">{request.unitsRequired} Pints</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PATIENT INITIALS</span>
              <span className="font-semibold text-slate-800">{request.patientInitials}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">REQUIRED BY</span>
              <span className="font-semibold text-slate-800">
                {new Date(request.requiredBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          {request.notes && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 block text-[10px]">REQUESTER NOTES</span>
              <p className="text-slate-700 italic">{request.notes}</p>
            </div>
          )}
        </div>

        <div className="text-xs space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Review / Verification Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Cross-matched patient records in ICU 302, genuine immediate blood necessity confirmed."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('REJECTED')}
              className="py-2.5 px-3 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-bold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('INFO_REQUESTED')}
              className="py-2.5 px-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Info</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('VERIFIED')}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center space-x-1.5 shadow-sm transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Match</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
