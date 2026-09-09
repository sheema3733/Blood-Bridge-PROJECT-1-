import React, { useState } from 'react';
import { BloodGroup } from '../../../shared/types';
import { RECIPIENT_COMPATIBILITY_MAP, DONOR_COMPATIBILITY_MAP, CLINICAL_DISCLAIMER } from '../../../shared/bloodRules';
import { Info, Check, X } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const BloodCompatibilityMatrix: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [viewMode, setViewMode] = useState<'canReceiveFrom' | 'canDonateTo'>('canReceiveFrom');

  const activeMatches = viewMode === 'canReceiveFrom'
    ? RECIPIENT_COMPATIBILITY_MAP[selectedGroup] || []
    : DONOR_COMPATIBILITY_MAP[selectedGroup] || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Interactive Blood Compatibility Guide</h3>
          <p className="text-sm text-slate-500">
            Select a blood group to view transfusion compatibility rules.
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('canReceiveFrom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'canReceiveFrom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Can Receive From
          </button>
          <button
            onClick={() => setViewMode('canDonateTo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'canDonateTo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Can Donate To
          </button>
        </div>
      </div>

      {/* Blood Group Selector Chips */}
      <div className="flex flex-wrap gap-2">
        {BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedGroup(bg)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              selectedGroup === bg
                ? 'bg-red-600 text-white shadow-md shadow-red-200 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {BLOOD_GROUPS.map((bg) => {
          const isCompatible = activeMatches.includes(bg);
          const isSelf = bg === selectedGroup;

          return (
            <div
              key={bg}
              className={`p-4 rounded-xl border flex items-center justify-between transition ${
                isCompatible
                  ? isSelf
                    ? 'bg-red-50 border-red-300 ring-2 ring-red-400/30'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-lg font-bold block">{bg}</span>
                <span className="text-xs text-slate-500 font-medium">
                  {isSelf ? 'Selected' : isCompatible ? 'Compatible' : 'Incompatible'}
                </span>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isCompatible ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isCompatible ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start space-x-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>{CLINICAL_DISCLAIMER}</p>
      </div>
    </div>
  );
};
