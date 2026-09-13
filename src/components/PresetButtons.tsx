'use client';

import React from 'react';
import { PRESET_INFOS } from '@/lib/presets';
import { DollarSign, Clock, Car, Check } from 'lucide-react';

interface PresetButtonsProps {
  selectedPresetKey: 'A' | 'B' | 'C' | null;
  onSelectPreset: (key: 'A' | 'B' | 'C') => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  selectedPresetKey,
  onSelectPreset,
}) => {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            3 Phương án Cân bằng Tiêu biểu từ Bài báo Khoa học
          </h2>
          <p className="text-xs text-slate-400">
            Tải nhanh kết quả thực nghiệm chuẩn từ nghiên cứu của Đặng Minh Hải (2018)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESET_INFOS.map((info) => {
          const isSelected = selectedPresetKey === info.key;
          const borderClass = isSelected
            ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-900/20'
            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40';

          return (
            <div
              key={info.key}
              onClick={() => onSelectPreset(info.key)}
              className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${borderClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {info.badge}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                      <Check className="w-3.5 h-3.5" />
                      Đang chọn
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {info.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {info.description}
                </p>

                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Chi phí C_ct:
                    </span>
                    <span className="font-bold text-emerald-400">{info.costDesc}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Tuổi thọ SL:
                    </span>
                    <span className="font-bold text-cyan-400">{info.lifeDesc}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      Giao thông GT:
                    </span>
                    <span className="font-bold text-amber-400">{info.trafficDesc}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {isSelected ? 'Đã kích hoạt phương án' : 'Áp dụng phương án này'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
