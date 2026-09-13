'use client';

import React, { useMemo } from 'react';
import { WeightPreferences, Individual } from '@/types';
import { Target, Award, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface WeightFilterProps {
  weights: WeightPreferences;
  onChangeWeights: (weights: WeightPreferences) => void;
  solutions: Individual[];
  onSelectSolution: (solution: Individual) => void;
}

export const WeightFilter: React.FC<WeightFilterProps> = ({
  weights,
  onChangeWeights,
  solutions,
  onSelectSolution,
}) => {
  // Normalize weights to sum = 100%
  const totalWeight = weights.costWeight + weights.lifespanWeight + weights.trafficWeight || 1;
  const normCost = weights.costWeight / totalWeight;
  const normLife = weights.lifespanWeight / totalWeight;
  const normTraffic = weights.trafficWeight / totalWeight;

  // Calculate MCDA Scores using Simple Additive Weighting (SAW) on Pareto Front
  const scoredSolutions = useMemo(() => {
    if (solutions.length === 0) return [];

    let minCost = Infinity, maxCost = -Infinity;
    let minLife = Infinity, maxLife = -Infinity;
    let minTraffic = Infinity, maxTraffic = -Infinity;

    for (const sol of solutions) {
      if (sol.costBillion < minCost) minCost = sol.costBillion;
      if (sol.costBillion > maxCost) maxCost = sol.costBillion;
      if (sol.lifespan < minLife) minLife = sol.lifespan;
      if (sol.lifespan > maxLife) maxLife = sol.lifespan;
      if (sol.traffic < minTraffic) minTraffic = sol.traffic;
      if (sol.traffic > maxTraffic) maxTraffic = sol.traffic;
    }

    const rangeCost = maxCost - minCost || 1;
    const rangeLife = maxLife - minLife || 1;
    const rangeTraffic = maxTraffic - minTraffic || 1;

    return solutions.map((sol) => {
      // Cost: MIN (càng nhỏ điểm càng cao)
      const scoreC = (maxCost - sol.costBillion) / rangeCost;
      // Lifespan: MAX (càng lớn điểm càng cao)
      const scoreL = (sol.lifespan - minLife) / rangeLife;
      // Traffic: MIN (càng ít tắc điểm càng cao)
      const scoreT = (maxTraffic - sol.traffic) / rangeTraffic;

      const totalScore = normCost * scoreC + normLife * scoreL + normTraffic * scoreT;

      return {
        solution: sol,
        score: Math.round(totalScore * 1000) / 10, // 0 - 100
        scoreBreakdown: {
          cost: Math.round(scoreC * 100),
          life: Math.round(scoreL * 100),
          traffic: Math.round(scoreT * 100),
        },
      };
    }).sort((a, b) => b.score - a.score);
  }, [solutions, normCost, normLife, normTraffic]);

  const bestMatch = scoredSolutions[0];

  const handleSliderChange = (key: keyof WeightPreferences, value: number) => {
    onChangeWeights({
      ...weights,
      [key]: value,
    });
  };

  const setPresetWeights = (c: number, l: number, t: number) => {
    onChangeWeights({
      costWeight: c,
      lifespanWeight: l,
      trafficWeight: t,
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Bộ Lọc Quyết định Đa tiêu chí (MCDA / AHP Decision Matrix)
          </h2>
          <p className="text-xs text-slate-400">
            Kéo thanh trượt để xác định mức độ ưu tiên giữa 3 mục tiêu • Tự động đề xuất giải pháp tối ưu nhất
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setPresetWeights(70, 15, 15)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-emerald-300 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/40 transition"
          >
            Ưu tiên Ngân sách (70%)
          </button>
          <button
            onClick={() => setPresetWeights(15, 70, 15)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-cyan-300 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500/40 transition"
          >
            Ưu tiên Bền vững (70%)
          </button>
          <button
            onClick={() => setPresetWeights(15, 15, 70)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-amber-300 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/40 transition"
          >
            Ưu tiên Giao thông (70%)
          </button>
          <button
            onClick={() => setPresetWeights(33.3, 33.3, 33.3)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
          >
            Cân bằng Đều
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cost Slider */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Trọng số Tiết kiệm Chi phí (w_C)
              </span>
              <span className="font-bold font-mono text-emerald-400">
                {Math.round(normCost * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.costWeight}
              onChange={(e) => handleSliderChange('costWeight', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Lifespan Slider */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Trọng số Tuổi thọ Hệ thống (w_SL)
              </span>
              <span className="font-bold font-mono text-cyan-400">
                {Math.round(normLife * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.lifespanWeight}
              onChange={(e) => handleSliderChange('lifespanWeight', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Traffic Disruption Slider */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-amber-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Trọng số Giảm Ùn tắc Giao thông (w_GT)
              </span>
              <span className="font-bold font-mono text-amber-400">
                {Math.round(normTraffic * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.trafficWeight}
              onChange={(e) => handleSliderChange('trafficWeight', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Best Compromise Recommendation Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                Giải pháp Khuyến nghị Hàng đầu
              </span>

              {bestMatch && (
                <span className="text-xs font-mono font-bold text-amber-400">
                  Điểm: {bestMatch.score}/100
                </span>
              )}
            </div>

            {bestMatch ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400">Mã cá thể Pareto:</div>
                  <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    {bestMatch.solution.id}
                    {bestMatch.solution.isPreset && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-sans">
                        Phương án {bestMatch.solution.isPreset}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chi phí cải tạo C_ct:</span>
                    <span className="font-bold text-emerald-400">
                      {bestMatch.solution.costBillion.toFixed(3)} tỷ VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tuổi thọ trung bình SL:</span>
                    <span className="font-bold text-cyan-400">
                      {bestMatch.solution.lifespan} năm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ảnh hưởng giao thông GT:</span>
                    <span className="font-bold text-amber-400">
                      {bestMatch.solution.traffic} xe/giờ
                    </span>
                  </div>
                </div>

                {/* Score breakdown bars */}
                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Độ hài lòng Chi phí:</span>
                    <span className="text-emerald-400 font-semibold">{bestMatch.scoreBreakdown.cost}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Độ hài lòng Tuổi thọ:</span>
                    <span className="text-cyan-400 font-semibold">{bestMatch.scoreBreakdown.life}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Độ hài lòng Giao thông:</span>
                    <span className="text-amber-400 font-semibold">{bestMatch.scoreBreakdown.traffic}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có dữ liệu. Vui lòng bấm &quot;Chạy thuật toán NSGA-II&quot; hoặc chọn một phương án mẫu.
              </p>
            )}
          </div>

          {bestMatch && (
            <button
              onClick={() => onSelectSolution(bestMatch.solution)}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/30"
            >
              Chọn và Kiểm tra 18 Đoạn Cống
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
