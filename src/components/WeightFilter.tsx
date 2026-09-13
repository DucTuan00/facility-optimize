'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { WeightPreferences, Individual } from '@/types';
import { Target, Award, ArrowDown, CheckCircle2 } from 'lucide-react';

interface WeightFilterProps {
  weights: WeightPreferences;
  onChangeWeights: (weights: WeightPreferences) => void;
  solutions: Individual[];
  onSelectSolution: (solution: Individual) => void;
  selectedSolutionId?: string;
}

export const WeightFilter: React.FC<WeightFilterProps> = ({
  weights,
  onChangeWeights,
  solutions,
  onSelectSolution,
  selectedSolutionId,
}) => {
  const isUserInteracting = useRef(false);

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
        score: Math.round(totalScore * 1000) / 10,
        scoreBreakdown: {
          cost: Math.round(scoreC * 100),
          life: Math.round(scoreL * 100),
          traffic: Math.round(scoreT * 100),
        },
      };
    }).sort((a, b) => b.score - a.score);
  }, [solutions, normCost, normLife, normTraffic]);

  const bestMatch = scoredSolutions[0];

  // Auto-sync best match whenever user changes weights
  useEffect(() => {
    if (isUserInteracting.current && bestMatch) {
      onSelectSolution(bestMatch.solution);
      isUserInteracting.current = false;
    }
  }, [bestMatch, onSelectSolution]);

  const handleSliderChange = (key: keyof WeightPreferences, value: number) => {
    isUserInteracting.current = true;
    onChangeWeights({
      ...weights,
      [key]: value,
    });
  };

  const setPresetWeights = (c: number, l: number, t: number) => {
    isUserInteracting.current = true;
    onChangeWeights({
      costWeight: c,
      lifespanWeight: l,
      trafficWeight: t,
    });
  };

  const isCurrentActive = bestMatch && selectedSolutionId === bestMatch.solution.id;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            Lọc Quyết định theo Trọng số Ưu tiên (MCDA / AHP)
          </h2>
          <p className="text-xs text-slate-500">
            Kéo thanh trượt để thay đổi mức độ ưu tiên • Bảng 18 cống sẽ tự động đồng bộ theo thời gian thực
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPresetWeights(70, 15, 15)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
          >
            Ưu tiên Ngân sách (70%)
          </button>
          <button
            type="button"
            onClick={() => setPresetWeights(15, 70, 15)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
          >
            Ưu tiên Độ bền (70%)
          </button>
          <button
            type="button"
            onClick={() => setPresetWeights(15, 15, 70)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
          >
            Ưu tiên Giao thông (70%)
          </button>
          <button
            type="button"
            onClick={() => setPresetWeights(33.3, 33.3, 33.3)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
          >
            Cân bằng Đều
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sliders Area */}
        <div className="lg:col-span-2 space-y-3.5">
          {/* Cost Slider */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-800 font-semibold">1. Tiết kiệm Chi phí đầu tư (w_C)</span>
              <span className="font-bold font-mono text-emerald-700">
                {Math.round(normCost * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.costWeight}
              onChange={(e) => handleSliderChange('costWeight', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Lifespan Slider */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-800 font-semibold">2. Kéo dài Tuổi thọ cống (w_SL)</span>
              <span className="font-bold font-mono text-sky-700">
                {Math.round(normLife * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.lifespanWeight}
              onChange={(e) => handleSliderChange('lifespanWeight', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Traffic Slider */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-800 font-semibold">3. Giảm Ùn tắc Giao thông đô thị (w_GT)</span>
              <span className="font-bold font-mono text-amber-700">
                {Math.round(normTraffic * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.trafficWeight}
              onChange={(e) => handleSliderChange('trafficWeight', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>

        {/* Best Solution Recommendation Card */}
        <div className="flex flex-col justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Giải pháp Phù hợp nhất
              </span>

              {bestMatch && (
                <span className="text-xs font-mono font-bold text-slate-800">
                  {bestMatch.score}/100 đ
                </span>
              )}
            </div>

            {bestMatch ? (
              <div className="space-y-2.5">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Mã phương án:</div>
                  <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5">
                    {bestMatch.solution.id}
                    {bestMatch.solution.isPreset && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-sans">
                        Mẫu {bestMatch.solution.isPreset}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chi phí cải tạo:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {bestMatch.solution.costBillion.toFixed(3)} tỷ VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tuổi thọ trung bình:</span>
                    <span className="font-bold text-sky-700 font-mono">
                      {bestMatch.solution.lifespan} năm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mức tắc đường:</span>
                    <span className="font-bold text-amber-700 font-mono">
                      {bestMatch.solution.traffic} xe/h
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Điểm Chi phí:</span>
                    <span className="font-mono font-semibold text-emerald-700">{bestMatch.scoreBreakdown.cost}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Điểm Tuổi thọ:</span>
                    <span className="font-mono font-semibold text-sky-700">{bestMatch.scoreBreakdown.life}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Điểm Giao thông:</span>
                    <span className="font-mono font-semibold text-amber-700">{bestMatch.scoreBreakdown.traffic}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                Chưa có dữ liệu. Vui lòng bấm &quot;Bắt đầu Chạy NSGA-II&quot; hoặc chọn một phương án mẫu.
              </p>
            )}
          </div>

          {bestMatch && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isCurrentActive
                    ? 'Đang hiển thị ở Bảng Bước 3'
                    : 'Đã tự động chọn phương án này'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectSolution(bestMatch.solution);
                  document.getElementById('step3-table')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Xem chi tiết 18 cống của phương án này</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
