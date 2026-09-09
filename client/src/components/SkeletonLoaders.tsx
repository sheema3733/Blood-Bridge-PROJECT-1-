import React from 'react';

export const RequestCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-slate-200 rounded" />
            <div className="w-20 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-slate-200 rounded-full" />
      </div>

      <div className="space-y-2 py-2">
        <div className="w-full h-3 bg-slate-100 rounded" />
        <div className="w-3/4 h-3 bg-slate-100 rounded" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="w-24 h-4 bg-slate-200 rounded" />
        <div className="w-20 h-8 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-4 bg-slate-200 rounded" />
        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="w-16 h-8 bg-slate-300 rounded" />
      <div className="w-36 h-3 bg-slate-100 rounded" />
    </div>
  );
};
