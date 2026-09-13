'use client';

import React from 'react';
import { BookOpen, Layers, Info } from 'lucide-react';

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
    <header className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              Mô hình toán học NSGA-II
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Bộ dữ liệu thực nghiệm 18 đoạn cống đô thị (Đặng Minh Hải, 2018)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isRunning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              {isRunning ? 'Web Worker đang tính...' : 'Client-side Web Worker'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hệ thống Tối ưu hóa Đa mục tiêu Cải tạo Mạng lưới Thoát nước Đô thị
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Ứng dụng giải thuật di truyền NSGA-II hỗ trợ ra quyết định cân bằng giữa Chi phí đầu tư, Tuổi thọ cống và Ảnh hưởng giao thông
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <Layers className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Tập nghiệm tối ưu</div>
              <div className="text-sm font-bold text-slate-900 font-mono">{paretoCount} nghiệm</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenResearchModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Cơ sở Lý thuyết & Bảng tính
          </button>
        </div>
      </div>
    </header>
  );
};
