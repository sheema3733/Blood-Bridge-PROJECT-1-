import React, { useState } from 'react';
import { PackagePlus, X, Calendar, Droplet } from 'lucide-react';
import { BloodGroup } from '../../../../shared/types';

export interface RestockInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBloodGroup?: BloodGroup;
  onRestock: (data: {
    bloodGroup: BloodGroup;
    units: number;
    collectedAt?: string;
  }) => Promise<void>;
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const RestockInventoryModal: React.FC<RestockInventoryModalProps> = ({
  isOpen,
  onClose,
  defaultBloodGroup = 'O-',
  onRestock,
}) => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(defaultBloodGroup);
  const [units, setUnits] = useState<number>(5);
  const [collectedAt, setCollectedAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRestock({
        bloodGroup,
        units,
        collectedAt,
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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Restock Blood Reserve</h3>
              <p className="text-xs text-slate-500">Record a new verified batch into blood bank inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Blood Group
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    bloodGroup === bg
                      ? 'bg-red-600 border-red-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity (Units / Bags)
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setUnits(Math.max(1, units - 1))}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={100}
                value={units}
                onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center font-bold text-base py-1.5 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setUnits(units + 1)}
                className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Collection Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={collectedAt}
                onChange={(e) => setCollectedAt(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 text-xs"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Whole blood expires 42 days from collection date.
            </p>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-200 disabled:opacity-50"
            >
              <Droplet className="w-3.5 h-3.5" />
              {isSubmitting ? 'Logging...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
