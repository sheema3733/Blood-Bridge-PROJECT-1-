import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { X, Heart, ThumbsDown, Navigation, Building2, Clock, AlertCircle } from 'lucide-react';
import { CLINICAL_DISCLAIMER } from '@shared/bloodRules';

interface AcceptDeclineModalProps {
  isOpen: boolean;
  match: any | null;
  onClose: () => void;
  onResponded: () => void;
}

export const AcceptDeclineModal: React.FC<AcceptDeclineModalProps> = ({
  isOpen,
  match,
  onClose,
  onResponded,
}) => {
  const { showToast } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (!isOpen || !match) return null;

  const request = match.bloodRequest;

  const handleResponse = async (action: 'ACCEPT' | 'DECLINE') => {
    setIsSubmitting(true);
    try {
      const res = await api.respondToMatch(match.id, action, declineReason.trim() || undefined);
      if (res.success) {
        if (action === 'ACCEPT') {
          showToast(
            '❤️ Thank You Hero!',
            'You accepted the emergency blood request. Hospital notified.',
            'success'
          );
        } else {
          showToast('Request Declined', 'Prompt response recorded. Thank you.', 'info');
        }
        onResponded();
        onClose();
      }
    } catch (err: any) {
      showToast('Response Failed', err.message || 'Could not process response.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 border border-slate-200 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <h3 className="text-base font-bold text-slate-900">Emergency Donation Dispatch</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Call Card */}
        <div className="my-4 p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-crimson-800 bg-white px-2.5 py-1 rounded-lg border border-red-200 shadow-sm">
                {request.bloodGroup}
              </span>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {request.unitsRequired} {request.unitsRequired === 1 ? 'Unit' : 'Units'} Required
                </span>
                <span className="text-[10px] text-red-700 font-bold uppercase">
                  {request.urgency} Priority
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {match.matchScore}% Match Score
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-red-200/60 text-slate-700">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-900">{request.hospital.hospitalName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                Approx. <strong className="text-slate-900">{match.distanceKm} km</strong> from your location
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                Required by:{' '}
                <strong className="text-slate-900">
                  {new Date(request.requiredBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </strong>
              </span>
            </div>
          </div>

          {request.notes && (
            <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg italic">
              "{request.notes}"
            </p>
          )}
        </div>

        {/* Clinical Eligibility Notice */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 mb-4 flex items-start space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{CLINICAL_DISCLAIMER}</span>
        </div>

        {/* Decline Reason Input (Optional) */}
        {showDeclineReason && (
          <div className="mb-4 text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for declining (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Traveling out of city, unwell today..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          {!showDeclineReason ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowDeclineReason(true)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition"
            >
              Cannot Donate
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleResponse('DECLINE')}
              className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition disabled:opacity-50"
            >
              Confirm Decline
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleResponse('ACCEPT')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-white font-bold flex items-center justify-center space-x-2 shadow-sm transition disabled:opacity-50"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Accept & Coordinate Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
