'use client';

import React, { useState } from 'react';
import { Play, Square, RotateCcw, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { AlgorithmParams, AlgorithmProgress } from '@/types';

interface ControlPanelProps {
  params: AlgorithmParams;
  onChangeParams: (newParams: AlgorithmParams) => void;
  isRunning: boolean;
  progress: AlgorithmProgress | null;
  elapsedMs: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  onChangeParams,
  isRunning,
  progress,
  elapsedMs,
  onStart,
  onStop,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Chạy Mô phỏng Tối ưu hóa NSGA-II
          </h2>
          <p className="text-xs text-slate-500">
            Giải thuật chạy trực tiếp trên trình duyệt bằng Web Worker • Không gửi dữ liệu ra ngoài
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Ẩn tham số
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Cấu hình tham số (Np, Ng...)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isRunning}
            title="Khôi phục tham số mặc định"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 disabled:opacity-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {!isRunning ? (
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Bắt đầu Chạy NSGA-II
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs shadow-xs transition active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Dừng Thuật toán
            </button>
          )}
        </div>
      </div>

      {/* Advanced Parameters Accordion */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 animate-fadeIn">
          {/* Pop Size Np */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700">Kích thước quần thể (Np)</span>
              <span className="font-bold text-slate-900 font-mono">{params.popSize} cá thể</span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={params.popSize}
              disabled={isRunning}
              onChange={(e) =>
                onChangeParams({ ...params, popSize: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 80 - 100</span>
          </div>

          {/* Max Generations Ng */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700">Số thế hệ tiến hóa (Ng)</span>
              <span className="font-bold text-slate-900 font-mono">{params.maxGenerations} thế hệ</span>
            </div>
            <input
              type="range"
              min={100}
              max={600}
              step={20}
              value={params.maxGenerations}
              disabled={isRunning}
              onChange={(e) =>
                onChangeParams({ ...params, maxGenerations: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 320</span>
          </div>

          {/* Crossover Prob Pc */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700">Xác suất lai ghép 2 điểm (Pc)</span>
              <span className="font-bold text-slate-900 font-mono">{params.crossoverProb}</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={0.95}
              step={0.01}
              value={params.crossoverProb}
              disabled={isRunning}
              onChange={(e) =>
                onChangeParams({ ...params, crossoverProb: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 0.90</span>
          </div>

          {/* Mutation Prob Pm */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700">Xác suất đột biến (Pm)</span>
              <span className="font-bold text-slate-900 font-mono">{params.mutationProb}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.15}
              step={0.01}
              value={params.mutationProb}
              disabled={isRunning}
              onChange={(e) =>
                onChangeParams({ ...params, mutationProb: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 0.08</span>
          </div>
        </div>
      )}

      {/* Progress & Live Results */}
      {progress && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
                }`}
              />
              <span className="font-semibold text-slate-800">
                {isRunning ? 'Đang tiến hóa qua các thế hệ...' : 'Tối ưu hóa hoàn tất!'}
              </span>
              <span className="font-mono text-slate-500">
                (Thế hệ {progress.generation} / {progress.maxGenerations})
              </span>
            </div>
            <div className="font-mono font-bold text-blue-600 text-xs">
              {progress.percent}% {elapsedMs > 0 && `• ${(elapsedMs / 1000).toFixed(1)}s`}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
            />
          </div>

          {/* Progress KPI summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Số nghiệm Pareto (F1)</div>
              <div className="text-sm font-bold text-slate-900 font-mono">{progress.paretoCount} nghiệm</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Chi phí thấp nhất</div>
              <div className="text-sm font-bold text-emerald-700 font-mono">{progress.currentBest.minCost} tỷ VNĐ</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Tuổi thọ cao nhất</div>
              <div className="text-sm font-bold text-sky-700 font-mono">{progress.currentBest.maxLife} năm</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Tắc đường thấp nhất</div>
              <div className="text-sm font-bold text-amber-700 font-mono">{progress.currentBest.minTraffic} xe/h</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
