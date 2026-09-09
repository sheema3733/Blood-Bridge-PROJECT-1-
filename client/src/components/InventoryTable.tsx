import React from 'react';
import { AlertCircle, PlusCircle, CheckCircle2 } from 'lucide-react';

export interface InventoryItem {
  bloodGroup: string;
  totalAvailable: number;
  totalReserved: number;
  totalExpired: number;
  criticalThreshold: number;
  isBelowThreshold: boolean;
}

export interface InventoryTableProps {
  items: InventoryItem[];
  onRestockClick: (bloodGroup: string) => void;
  onReserveClick: (bloodGroup: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onRestockClick,
  onReserveClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Hospital Blood Reserve Roster</h3>
          <p className="text-xs text-slate-500">Live units on-hand, reservations, and critical threshold monitoring.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Blood Group</th>
              <th className="py-3 px-4">Available Units</th>
              <th className="py-3 px-4">Reserved</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.bloodGroup} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black">
                    {item.bloodGroup}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  {item.totalAvailable} units
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {item.totalReserved} units
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {item.criticalThreshold} units
                </td>
                <td className="py-3 px-4">
                  {item.isBelowThreshold ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Adequate
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => onRestockClick(item.bloodGroup)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Restock
                  </button>
                  <button
                    onClick={() => onReserveClick(item.bloodGroup)}
                    disabled={item.totalAvailable <= 0}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
                  >
                    Reserve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
