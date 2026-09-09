import React, { useState } from 'react';
import { Radio, X, AlertTriangle } from 'lucide-react';
import { BloodGroup } from '../../../../shared/types';

export interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (data: {
    level: string;
    title: string;
    incidentDescription: string;
    affectedRegion: string;
    targetBloodGroups: string[];
    durationHours: number;
  }) => Promise<void>;
}

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  onDispatch,
}) => {
  const [level, setLevel] = useState<string>('LEVEL_2_METRO_ALERT');
  const [title, setTitle] = useState<string>('Mass Casualty Incident Alert');
  const [incidentDescription, setIncidentDescription] = useState<string>('');
  const [affectedRegion, setAffectedRegion] = useState<string>('Central Metro Hospital Cluster');
  const [targetBloodGroups, setTargetBloodGroups] = useState<string[]>(['O-', 'A-']);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleBloodGroup = (bg: string) => {
    setTargetBloodGroups((prev) =>
      prev.includes(bg) ? prev.filter((g) => g !== bg) : [...prev, bg]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onDispatch({
        level,
        title,
        incidentDescription,
        affectedRegion,
        targetBloodGroups,
        durationHours,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Issue Mass Emergency Broadcast</h3>
              <p className="text-xs text-slate-500">Tiered multi-channel emergency alert dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Broadcast Severity Tier</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
            >
              <option value="LEVEL_1_FACILITY_URGENT">Level 1: Facility-Specific Critical Deficit</option>
              <option value="LEVEL_2_METRO_ALERT">Level 2: Metro-Wide Multi-Casualty Trauma</option>
              <option value="LEVEL_3_REGIONAL_DISASTER">Level 3: Regional Disaster / Catastrophe</option>
              <option value="LEVEL_4_NATIONAL_RESERVE">Level 4: National Strategic Shortage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Headline / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Summary & Need</label>
            <textarea
              rows={3}
              required
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              placeholder="e.g. Major highway collision requiring urgent emergency surgery units across city hospitals."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Geographic Zone</label>
              <input
                type="text"
                required
                value={affectedRegion}
                onChange={(e) => setAffectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Lifespan (Hours)</label>
              <input
                type="number"
                min={1}
                max={72}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority Blood Groups Needed
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ALL_BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => toggleBloodGroup(bg)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    targetBloodGroups.includes(bg)
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-900 rounded-xl text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>This broadcast triggers high-priority push, SMS, and global web banners.</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-md shadow-red-200 disabled:opacity-50"
            >
              <Radio className="w-3.5 h-3.5" />
              {isSubmitting ? 'Broadcasting...' : 'Dispatch Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
