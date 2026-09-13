'use client';

import React from 'react';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenResearchModal: () => void;
  paretoCount: number;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenResearchModal,
  paretoCount,
  isRunning,
}) => {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 shadow-2xl backdrop-blur-xl mb-6">
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Nghiên cứu khoa học 2018
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Đặng Minh Hải • Tạp chí KH&KT Thủy lợi & Môi trường
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              {isRunning ? 'Web Worker đang tính toán...' : '100% Client Web Worker'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Mô hình Tối ưu hóa Đa mục tiêu Cải tạo Hệ thống Thoát nước
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-300">
            Thành phố Sầm Sơn, Thanh Hóa • Giải thuật Di truyền NSGA-II (Nondominated Sorting Genetic Algorithm II)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tập Pareto</div>
              <div className="text-sm font-bold text-white">{paretoCount} nghiệm tối ưu</div>
            </div>
          </div>

          <button
            onClick={onOpenResearchModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-indigo-300" />
            Cơ sở lý thuyết & Công thức
          </button>
        </div>
      </div>
    </header>
  );
};
