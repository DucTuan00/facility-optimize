'use client';

import React from 'react';
import { PRESET_INFOS } from '@/lib/presets';
import { Check, CheckCircle2 } from 'lucide-react';

interface PresetButtonsProps {
  selectedPresetKey: 'A' | 'B' | 'C' | null;
  onSelectPreset: (key: 'A' | 'B' | 'C') => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  selectedPresetKey,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            3 Phương án Cải tạo Mẫu từ Bài báo Khoa học
          </h2>
          <p className="text-xs text-slate-500">
            Chọn nhanh phương án đã được tác giả công bố để xem chi tiết hoặc đối chiếu kết quả
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {PRESET_INFOS.map((info) => {
          const isSelected = selectedPresetKey === info.key;

          return (
            <div
              key={info.key}
              onClick={() => onSelectPreset(info.key)}
              className={`relative flex flex-col justify-between p-4 rounded-lg border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {info.badge}
                  </span>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Đang chọn
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Click để chọn</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {info.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-normal line-clamp-2">
                  {info.description}
                </p>

                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Chi phí cải tạo:</span>
                    <span className="font-bold text-emerald-700 font-mono">{info.costDesc}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tuổi thọ trung bình:</span>
                    <span className="font-bold text-sky-700 font-mono">{info.lifeDesc}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mức tắc đường:</span>
                    <span className="font-bold text-amber-700 font-mono">{info.trafficDesc}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-blue-700' : 'text-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {isSelected ? 'Đang chọn' : 'Click để chọn'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPreset(info.key);
                    document.getElementById('step3-table')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition underline underline-offset-2 cursor-pointer"
                >
                  Xem bảng 18 cống ↓
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
