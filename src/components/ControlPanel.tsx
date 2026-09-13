'use client';

import React, { useState } from 'react';
import { Play, Square, RotateCcw, Sliders, Zap } from 'lucide-react';
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
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Điều khiển Thuật toán Di truyền NSGA-II
          </h2>
          <p className="text-xs text-slate-400">
            Chạy 100% trong Web Worker Client-side • Không block giao diện
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
          >
            {showAdvanced ? 'Ẩn tham số nâng cao' : 'Tùy chỉnh tham số (Np, Ng...)'}
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            title="Đặt lại tham số chuẩn"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Parameters Sliders */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 animate-fadeIn">
          {/* Pop Size Np */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Kích thước quần thể (Np)</span>
              <span className="font-bold text-cyan-400">{params.popSize} cá thể</span>
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
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 80 - 100</span>
          </div>

          {/* Max Generations Ng */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Số thế hệ tiến hóa (Ng)</span>
              <span className="font-bold text-indigo-400">{params.maxGenerations} thế hệ</span>
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
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 320 (4x Np)</span>
          </div>

          {/* Crossover Prob Pc */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Xác suất lai ghép 2 điểm (Pc)</span>
              <span className="font-bold text-emerald-400">{params.crossoverProb}</span>
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
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 0.90</span>
          </div>

          {/* Mutation Prob Pm */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Xác suất đột biến (Pm)</span>
              <span className="font-bold text-amber-400">{params.mutationProb}</span>
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
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] text-slate-400">Khuyến nghị bài báo: 0.08</span>
          </div>
        </div>
      )}

      {/* Main Action Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all active:scale-95 hover:shadow-cyan-500/40"
            >
              <Play className="w-4 h-4 fill-current" />
              Chạy Thuật toán NSGA-II
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              Dừng Thuật toán
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Cấu hình: Np={params.popSize}, Ng={params.maxGenerations}, Pc={params.crossoverProb}, Pm={params.mutationProb}
            </span>
          </div>
        </div>

        {/* Runtime info */}
        {elapsedMs > 0 && (
          <div className="text-xs text-slate-400 text-right">
            Thời gian chạy: <span className="font-mono text-cyan-300 font-semibold">{(elapsedMs / 1000).toFixed(2)}s</span>
          </div>
        )}
      </div>

      {/* Progress Bar & Realtime Convergence stats */}
      {progress && (
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-semibold text-slate-200">
                {isRunning ? 'Tiến trình tiến hóa...' : 'Đã hoàn thành tối ưu hóa!'}
              </span>
              <span className="font-mono text-slate-400">
                (Thế hệ {progress.generation} / {progress.maxGenerations})
              </span>
            </div>
            <div className="font-mono font-bold text-cyan-400">
              {progress.percent}%
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
            />
          </div>

          {/* Quick Metrics of current front */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-2">
            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Số nghiệm Pareto (F1)</div>
              <div className="text-sm font-bold text-cyan-300">{progress.paretoCount} nghiệm</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Chi phí thấp nhất</div>
              <div className="text-sm font-bold text-emerald-300">{progress.currentBest.minCost} tỷ VNĐ</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Tuổi thọ cao nhất</div>
              <div className="text-sm font-bold text-blue-300">{progress.currentBest.maxLife} năm</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase">Tắc đường thấp nhất</div>
              <div className="text-sm font-bold text-amber-300">{progress.currentBest.minTraffic} xe/h</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
