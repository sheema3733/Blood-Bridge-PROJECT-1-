import React, { useState } from 'react';
import { Sliders, X, Moon, MapPin } from 'lucide-react';

export interface DonorPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDistanceKm?: number;
  initialChannels?: string[];
  initialQuietHours?: boolean;
  initialEmergencyOnly?: boolean;
  onSave: (data: {
    maxTravelDistanceKm: number;
    channels: string[];
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    emergencyOnly: boolean;
  }) => Promise<void>;
}

export const DonorPreferencesModal: React.FC<DonorPreferencesModalProps> = ({
  isOpen,
  onClose,
  initialDistanceKm = 25,
  initialChannels = ['PUSH', 'SMS'],
  initialQuietHours = false,
  initialEmergencyOnly = false,
  onSave,
}) => {
  const [distance, setDistance] = useState<number>(initialDistanceKm);
  const [channels, setChannels] = useState<string[]>(initialChannels);
  const [quietHours, setQuietHours] = useState<boolean>(initialQuietHours);
  const [quietStart] = useState<string>('22:00');
  const [quietEnd] = useState<string>('07:00');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(initialEmergencyOnly);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        maxTravelDistanceKm: distance,
        channels: channels.length > 0 ? channels : ['PUSH'],
        quietHoursEnabled: quietHours,
        quietHoursStart: quietStart,
        quietHoursEnd: quietEnd,
        emergencyOnly,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Alert & Dispatch Preferences</h3>
              <p className="text-xs text-slate-500">Configure your travel range and notifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          {/* Max Distance Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                Max Travel Distance
              </span>
              <span className="text-red-600 font-bold">{distance} km</span>
            </div>
            <input
              type="range"
              min={2}
              max={100}
              step={1}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          {/* Channels */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notification Channels
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['PUSH', 'SMS', 'EMAIL', 'WHATSAPP'].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    channels.includes(ch)
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                Quiet Hours Window (10 PM - 7 AM)
              </span>
              <input
                type="checkbox"
                checked={quietHours}
                onChange={(e) => setQuietHours(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
            </label>
            <p className="text-[11px] text-slate-500">
              Only critical tier emergencies will bypass quiet hours.
            </p>
          </div>

          {/* Emergency Only */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">
                Critical Emergency Only Alerts
              </span>
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
            </label>
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
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-md shadow-red-200 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
