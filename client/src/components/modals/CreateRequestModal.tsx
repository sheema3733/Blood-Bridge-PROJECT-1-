import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { BloodGroup, UrgencyLevel } from '@shared/types';
import { X, AlertTriangle, Building2, Droplets, Clock, HeartHandshake } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCreated: (request: any) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCIES: { level: UrgencyLevel; label: string; desc: string; color: string }[] = [
  { level: 'NORMAL', label: 'Standard', desc: 'Elective surgery within 24h', color: 'border-slate-300 text-slate-700' },
  { level: 'URGENT', label: 'Urgent', desc: 'Needed within 4-8 hours', color: 'border-amber-400 bg-amber-50 text-amber-900' },
  { level: 'CRITICAL', label: 'Critical / STAT', desc: 'Immediate transfusion needed (<2h)', color: 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-300' },
];

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestCreated,
}) => {
  const { showToast } = useNotifications();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hospitalId, setHospitalId] = useState('');
  const [patientInitials, setPatientInitials] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT');
  const [requiredBy, setRequiredBy] = useState(() => {
    const d = new Date(Date.now() + 4 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState('');
  const [duplicateAlert, setDuplicateAlert] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHospitals();
    }
  }, [isOpen]);

  const loadHospitals = async () => {
    setIsLoadingHospitals(true);
    try {
      const res = await api.getHospitalsList();
      if (res.success && res.hospitals.length > 0) {
        setHospitals(res.hospitals);
        setHospitalId(res.hospitals[0].id);
      }
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId) {
      showToast('Validation Error', 'Please select a hospital.', 'error');
      return;
    }
    if (!patientInitials.trim()) {
      showToast('Validation Error', 'Please specify patient initials for coordination.', 'error');
      return;
    }

    setIsSubmitting(true);
    setDuplicateAlert(null);

    try {
      const res = await api.createBloodRequest({
        hospitalId,
        patientInitials: patientInitials.trim(),
        bloodGroup,
        unitsRequired: Number(unitsRequired),
        urgency,
        requiredBy: new Date(requiredBy).toISOString(),
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        if (res.duplicateWarning) {
          setDuplicateAlert(res.duplicateWarning);
          showToast(
            'Duplicate Check Notice',
            `Similar active request detected (${res.duplicateWarning.similarityScore}% match). Hospital will triage.`,
            'warning'
          );
        } else {
          showToast('Request Created', 'Emergency request dispatched to hospital verification queue.', 'success');
        }

        onRequestCreated(res.request);

        // If not flagged as duplicate, close immediately
        if (!res.duplicateWarning) {
          onClose();
        }
      }
    } catch (err: any) {
      showToast('Submission Failed', err.message || 'Could not submit blood request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-modal max-w-xl w-full p-6 border border-slate-200 my-8 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-crimson-100 text-crimson-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Initiate Emergency Blood Request</h3>
              <p className="text-xs text-slate-500">Verified hospital coordination workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Banner */}
        {duplicateAlert && (
          <div className="my-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Possible Duplicate Request Flagged ({duplicateAlert.similarityScore}% Match)
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Our system detected an existing active emergency matching this hospital and blood group.
                  The request was created with a warning flag and routed to hospital triage to prevent spam.
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={onClose}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Acknowledge & View Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Hospital Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Receiving Hospital *
            </label>
            <div className="relative">
              <select
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                disabled={isLoadingHospitals}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 focus:border-transparent bg-white text-slate-900"
                required
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hospitalName} ({h.address})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blood Group Pills */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Target Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 px-3 rounded-lg font-bold text-center border transition-all ${
                    bloodGroup === bg
                      ? 'bg-crimson-700 border-crimson-700 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Units Required & Patient Initials */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Units Required (Pints) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Patient Initials (Privacy Safe) *
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. M.K."
                value={patientInitials}
                onChange={(e) => setPatientInitials(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900 uppercase"
                required
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                No full PII broadcasted publicly.
              </span>
            </div>
          </div>

          {/* Urgency Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Urgency Level *</label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCIES.map((u) => (
                <button
                  type="button"
                  key={u.level}
                  onClick={() => setUrgency(u.level)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    urgency === u.level ? u.color : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">{u.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{u.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Required By Time */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Required By (Target Deadline) *
            </label>
            <input
              type="datetime-local"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
              required
            />
          </div>

          {/* Request Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Context / Ward Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. ICU Bed 4, planned cardiac surgery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-crimson-600 text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-white font-bold shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Dispatch Emergency Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
