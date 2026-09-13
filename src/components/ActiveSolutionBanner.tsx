'use client';

import React from 'react';
import { Individual } from '@/types';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface ActiveSolutionBannerProps {
  solution: Individual | null;
  onScrollToTable: () => void;
}

export const ActiveSolutionBanner: React.FC<ActiveSolutionBannerProps> = ({
  solution,
  onScrollToTable,
}) => {
  if (!solution) return null;

  return (
    <aside
      aria-label="Phương án đang chọn"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border border-slate-300/80 shadow-xl rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px]">Đang xem:</span>
            <span className="font-bold text-slate-900 font-mono text-xs truncate">
              {solution.id}
            </span>
            {solution.isPreset ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                Phương án mẫu {solution.isPreset}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Nghiệm NSGA-II
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 mt-0.5">
            <span>
              Chi phí: <strong className="text-emerald-700 font-mono">{solution.costBillion.toFixed(3)} tỷ</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Tuổi thọ: <strong className="text-sky-700 font-mono">{solution.lifespan} năm</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Tắc đường: <strong className="text-amber-700 font-mono">{solution.traffic} xe/h</strong>
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onScrollToTable}
        className="shrink-0 w-full sm:w-auto px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
      >
        <span>Xem bảng 18 cống</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
