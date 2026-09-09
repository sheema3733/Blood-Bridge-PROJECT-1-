import React from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';
import { BloodGroup } from '../../../shared/types';

export interface FilterCriteria {
  bloodGroups: BloodGroup[];
  urgency: 'ALL' | 'CRITICAL' | 'URGENT' | 'NORMAL';
  maxDistanceKm: number;
  hospitalVerifiedOnly: boolean;
}

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: FilterCriteria;
  onChange: (updated: FilterCriteria) => void;
  onReset: () => void;
}

const ALL_BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  criteria,
  onChange,
  onReset,
}) => {
  if (!isOpen) return null;

  const toggleBloodGroup = (bg: BloodGroup) => {
    const exists = criteria.bloodGroups.includes(bg);
    const updated = exists
      ? criteria.bloodGroups.filter((g) => g !== bg)
      : [...criteria.bloodGroups, bg];
    onChange({ ...criteria, bloodGroups: updated });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-slate-900">Filter Coordination Requests</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Blood Groups */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Blood Groups
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_BLOOD_GROUPS.map((bg) => {
                  const isSelected = criteria.bloodGroups.includes(bg);
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => toggleBloodGroup(bg)}
                      className={`py-2 text-xs font-bold rounded-lg transition border ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['ALL', 'CRITICAL', 'URGENT', 'NORMAL'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onChange({ ...criteria, urgency: level })}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      criteria.urgency === level
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500">
                  Search Radius
                </span>
                <span className="font-bold text-red-600">{criteria.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={criteria.maxDistanceKm}
                onChange={(e) =>
                  onChange({ ...criteria, maxDistanceKm: Number(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Verified Only */}
            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.hospitalVerifiedOnly}
                  onChange={(e) =>
                    onChange({ ...criteria, hospitalVerifiedOnly: e.target.checked })
                  }
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">
                  Hospital-verified requests only
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition flex-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition flex-1 shadow-md shadow-red-200"
            >
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
