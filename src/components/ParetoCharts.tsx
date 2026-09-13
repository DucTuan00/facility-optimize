/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Individual } from '@/types';
import { Compass, BarChart2, Activity } from 'lucide-react';

interface ParetoChartsProps {
  solutions: Individual[];
  selectedSolution: Individual | null;
  onSelectSolution: (solution: Individual) => void;
  presetA: Individual;
  presetB: Individual;
  presetC: Individual;
}

type ChartViewType = 'cost-life' | 'cost-traffic' | '3d-pareto';

export const ParetoCharts: React.FC<ParetoChartsProps> = ({
  solutions,
  selectedSolution,
  onSelectSolution,
  presetA,
  presetB,
  presetC,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<ChartViewType>('cost-life');

  // Render chart whenever view, solutions, or selection changes
  useEffect(() => {
    let isCancelled = false;

    async function renderPlot() {
      if (!chartContainerRef.current) return;

      try {
        const Plotly = (await import('plotly.js-dist-min')).default;
        const container = chartContainerRef.current;

        // Pareto points data
        const paretoPoints = solutions.length > 0 ? solutions : [presetA, presetB, presetC];

        if (activeView === 'cost-life') {
          // 2D: Chi phí (Trục X) vs Tuổi thọ (Trục Y), màu sắc theo Lưu lượng Giao thông
          // Sắp xếp theo Chi phí để vẽ đường Pareto
          const sorted = [...paretoPoints].sort((a, b) => a.costBillion - b.costBillion);

          const traceParetoLine = {
            x: sorted.map((p) => p.costBillion),
            y: sorted.map((p) => p.lifespan),
            mode: 'lines',
            name: 'Đường cong Pareto',
            line: {
              color: 'rgba(6, 182, 212, 0.4)',
              width: 2,
              shape: 'spline',
            },
            hoverinfo: 'skip',
            type: 'scatter',
          };

          const traceParetoPoints = {
            x: paretoPoints.map((p) => p.costBillion),
            y: paretoPoints.map((p) => p.lifespan),
            text: paretoPoints.map(
              (p) =>
                `<b>Nghiệm:</b> ${p.id}<br>` +
                `<b>Chi phí:</b> ${p.costBillion.toFixed(3)} tỷ VNĐ<br>` +
                `<b>Tuổi thọ:</b> ${p.lifespan} năm<br>` +
                `<b>Ảnh hưởng GT:</b> ${p.traffic} xe/h`
            ),
            customdata: paretoPoints,
            mode: 'markers',
            name: 'Nghiệm Pareto',
            type: 'scatter',
            marker: {
              size: 10,
              color: paretoPoints.map((p) => p.traffic),
              colorscale: 'Viridis',
              colorbar: {
                title: { text: 'GT (xe/h)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 10 },
                len: 0.8,
              },
              showscale: true,
              line: { color: '#ffffff', width: 1 },
              opacity: 0.88,
            },
            hoverinfo: 'text',
          };

          // Presets trace
          const tracePresets = {
            x: [presetA.costBillion, presetB.costBillion, presetC.costBillion],
            y: [presetA.lifespan, presetB.lifespan, presetC.lifespan],
            text: [
              `<b>★ Phương án A (Min Chi phí)</b><br>Chi phí: ${presetA.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetA.lifespan} năm<br>GT: ${presetA.traffic} xe/h`,
              `<b>★ Phương án B (Max Tuổi thọ)</b><br>Chi phí: ${presetB.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetB.lifespan} năm<br>GT: ${presetB.traffic} xe/h`,
              `<b>★ Phương án C (Min Tắc đường)</b><br>Chi phí: ${presetC.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetC.lifespan} năm<br>GT: ${presetC.traffic} xe/h`,
            ],
            customdata: [presetA, presetB, presetC],
            mode: 'markers+text',
            name: 'Phương án mẫu A, B, C',
            textposition: 'top center',
            textfont: { color: '#f8fafc', size: 11, family: 'sans-serif' },
            type: 'scatter',
            marker: {
              size: 16,
              symbol: 'star-diamond',
              color: ['#10b981', '#3b82f6', '#f59e0b'],
              line: { color: '#ffffff', width: 2 },
            },
            hoverinfo: 'text',
          };

          // Selected trace
          const traces: any[] = [traceParetoLine, traceParetoPoints, tracePresets];

          if (selectedSolution) {
            traces.push({
              x: [selectedSolution.costBillion],
              y: [selectedSolution.lifespan],
              mode: 'markers',
              name: 'Nghiệm đang chọn',
              type: 'scatter',
              marker: {
                size: 20,
                symbol: 'circle-open',
                color: '#facc15', // Vibrant yellow
                line: { color: '#facc15', width: 3 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 60, r: 30, t: 30, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(15, 23, 42, 0.4)',
            xaxis: {
              title: { text: 'Tổng Chi phí C_ct (Tỷ VNĐ)', font: { color: '#94a3b8', size: 12 } },
              tickfont: { color: '#94a3b8', size: 10 },
              gridcolor: 'rgba(51, 65, 85, 0.3)',
              zerolinecolor: 'rgba(51, 65, 85, 0.5)',
            },
            yaxis: {
              title: { text: 'Tuổi thọ trung bình SL (Năm)', font: { color: '#94a3b8', size: 12 } },
              tickfont: { color: '#94a3b8', size: 10 },
              gridcolor: 'rgba(51, 65, 85, 0.3)',
              zerolinecolor: 'rgba(51, 65, 85, 0.5)',
            },
            legend: {
              font: { color: '#cbd5e1', size: 11 },
              orientation: 'h',
              y: 1.12,
              x: 0,
            },
            hovermode: 'closest',
          };

          const config: any = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          };

          await Plotly.react(container, traces, layout, config);
        } else if (activeView === 'cost-traffic') {
          // 2D: Chi phí (Trục X) vs Ảnh hưởng Giao thông (Trục Y), màu theo Tuổi thọ
          const sorted = [...paretoPoints].sort((a, b) => a.costBillion - b.costBillion);

          const traceParetoLine = {
            x: sorted.map((p) => p.costBillion),
            y: sorted.map((p) => p.traffic),
            mode: 'lines',
            name: 'Đường cong Pareto',
            line: {
              color: 'rgba(244, 63, 94, 0.4)',
              width: 2,
              shape: 'spline',
            },
            hoverinfo: 'skip',
            type: 'scatter',
          };

          const traceParetoPoints = {
            x: paretoPoints.map((p) => p.costBillion),
            y: paretoPoints.map((p) => p.traffic),
            text: paretoPoints.map(
              (p) =>
                `<b>Nghiệm:</b> ${p.id}<br>` +
                `<b>Chi phí:</b> ${p.costBillion.toFixed(3)} tỷ VNĐ<br>` +
                `<b>Ảnh hưởng GT:</b> ${p.traffic} xe/h<br>` +
                `<b>Tuổi thọ:</b> ${p.lifespan} năm`
            ),
            customdata: paretoPoints,
            mode: 'markers',
            name: 'Nghiệm Pareto',
            type: 'scatter',
            marker: {
              size: 10,
              color: paretoPoints.map((p) => p.lifespan),
              colorscale: 'Plasma',
              colorbar: {
                title: { text: 'TTC (năm)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 10 },
                len: 0.8,
              },
              showscale: true,
              line: { color: '#ffffff', width: 1 },
              opacity: 0.88,
            },
            hoverinfo: 'text',
          };

          const tracePresets = {
            x: [presetA.costBillion, presetB.costBillion, presetC.costBillion],
            y: [presetA.traffic, presetB.traffic, presetC.traffic],
            text: [
              `<b>★ Phương án A (Min Chi phí)</b><br>Chi phí: ${presetA.costBillion.toFixed(3)} tỷ<br>GT: ${presetA.traffic} xe/h<br>Tuổi thọ: ${presetA.lifespan} năm`,
              `<b>★ Phương án B (Max Tuổi thọ)</b><br>Chi phí: ${presetB.costBillion.toFixed(3)} tỷ<br>GT: ${presetB.traffic} xe/h<br>Tuổi thọ: ${presetB.lifespan} năm`,
              `<b>★ Phương án C (Min Tắc đường)</b><br>Chi phí: ${presetC.costBillion.toFixed(3)} tỷ<br>GT: ${presetC.traffic} xe/h<br>Tuổi thọ: ${presetC.lifespan} năm`,
            ],
            customdata: [presetA, presetB, presetC],
            mode: 'markers+text',
            name: 'Phương án mẫu A, B, C',
            textposition: 'top center',
            textfont: { color: '#f8fafc', size: 11, family: 'sans-serif' },
            type: 'scatter',
            marker: {
              size: 16,
              symbol: 'star-diamond',
              color: ['#10b981', '#3b82f6', '#f59e0b'],
              line: { color: '#ffffff', width: 2 },
            },
            hoverinfo: 'text',
          };

          const traces: any[] = [traceParetoLine, traceParetoPoints, tracePresets];

          if (selectedSolution) {
            traces.push({
              x: [selectedSolution.costBillion],
              y: [selectedSolution.traffic],
              mode: 'markers',
              name: 'Nghiệm đang chọn',
              type: 'scatter',
              marker: {
                size: 20,
                symbol: 'circle-open',
                color: '#facc15',
                line: { color: '#facc15', width: 3 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 60, r: 30, t: 30, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(15, 23, 42, 0.4)',
            xaxis: {
              title: { text: 'Tổng Chi phí C_ct (Tỷ VNĐ)', font: { color: '#94a3b8', size: 12 } },
              tickfont: { color: '#94a3b8', size: 10 },
              gridcolor: 'rgba(51, 65, 85, 0.3)',
              zerolinecolor: 'rgba(51, 65, 85, 0.5)',
            },
            yaxis: {
              title: { text: 'Mức ảnh hưởng Giao thông GT (xe/giờ)', font: { color: '#94a3b8', size: 12 } },
              tickfont: { color: '#94a3b8', size: 10 },
              gridcolor: 'rgba(51, 65, 85, 0.3)',
              zerolinecolor: 'rgba(51, 65, 85, 0.5)',
            },
            legend: {
              font: { color: '#cbd5e1', size: 11 },
              orientation: 'h',
              y: 1.12,
              x: 0,
            },
            hovermode: 'closest',
          };

          const config: any = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          };

          await Plotly.react(container, traces, layout, config);
        } else {
          // 3D: Không gian Pareto 3 Chiều (X: Chi phí, Y: Tuổi thọ, Z: Giao thông)
          const tracePareto3D = {
            x: paretoPoints.map((p) => p.costBillion),
            y: paretoPoints.map((p) => p.lifespan),
            z: paretoPoints.map((p) => p.traffic),
            text: paretoPoints.map(
              (p) =>
                `<b>Nghiệm:</b> ${p.id}<br>` +
                `<b>Chi phí:</b> ${p.costBillion.toFixed(3)} tỷ VNĐ<br>` +
                `<b>Tuổi thọ:</b> ${p.lifespan} năm<br>` +
                `<b>Ảnh hưởng GT:</b> ${p.traffic} xe/h`
            ),
            customdata: paretoPoints,
            mode: 'markers',
            name: 'Nghiệm Pareto',
            type: 'scatter3d',
            marker: {
              size: 5,
              color: paretoPoints.map((p) => p.costBillion),
              colorscale: 'Viridis',
              colorbar: {
                title: { text: 'Chi phí (Tỷ)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 10 },
                len: 0.7,
              },
              opacity: 0.85,
            },
            hoverinfo: 'text',
          };

          const tracePresets3D = {
            x: [presetA.costBillion, presetB.costBillion, presetC.costBillion],
            y: [presetA.lifespan, presetB.lifespan, presetC.lifespan],
            z: [presetA.traffic, presetB.traffic, presetC.traffic],
            text: [
              `<b>★ Phương án A (Min CPCT)</b><br>Chi phí: ${presetA.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetA.lifespan} năm<br>GT: ${presetA.traffic} xe/h`,
              `<b>★ Phương án B (Max Tuổi thọ)</b><br>Chi phí: ${presetB.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetB.lifespan} năm<br>GT: ${presetB.traffic} xe/h`,
              `<b>★ Phương án C (Min Tắc đường)</b><br>Chi phí: ${presetC.costBillion.toFixed(3)} tỷ<br>Tuổi thọ: ${presetC.lifespan} năm<br>GT: ${presetC.traffic} xe/h`,
            ],
            customdata: [presetA, presetB, presetC],
            mode: 'markers+text',
            name: 'Điểm A, B, C',
            textposition: 'top center',
            textfont: { color: '#ffffff', size: 11 },
            type: 'scatter3d',
            marker: {
              size: 10,
              color: ['#10b981', '#3b82f6', '#f59e0b'],
              symbol: 'diamond',
              line: { color: '#ffffff', width: 2 },
            },
            hoverinfo: 'text',
          };

          const traces: any[] = [tracePareto3D, tracePresets3D];

          if (selectedSolution) {
            traces.push({
              x: [selectedSolution.costBillion],
              y: [selectedSolution.lifespan],
              z: [selectedSolution.traffic],
              mode: 'markers',
              name: 'Đang chọn',
              type: 'scatter3d',
              marker: {
                size: 14,
                color: '#facc15',
                symbol: 'circle',
                line: { color: '#ffffff', width: 2 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 0, r: 0, t: 0, b: 0 },
            paper_bgcolor: 'transparent',
            scene: {
              xaxis: {
                title: { text: 'Chi phí (Tỷ)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 9 },
                gridcolor: 'rgba(51, 65, 85, 0.4)',
                backgroundcolor: 'rgba(15, 23, 42, 0.6)',
              },
              yaxis: {
                title: { text: 'Tuổi thọ (Năm)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 9 },
                gridcolor: 'rgba(51, 65, 85, 0.4)',
                backgroundcolor: 'rgba(15, 23, 42, 0.6)',
              },
              zaxis: {
                title: { text: 'Giao thông (xe/h)', font: { color: '#94a3b8', size: 11 } },
                tickfont: { color: '#94a3b8', size: 9 },
                gridcolor: 'rgba(51, 65, 85, 0.4)',
                backgroundcolor: 'rgba(15, 23, 42, 0.6)',
              },
              camera: {
                eye: { x: 1.6, y: 1.6, z: 1.3 },
              },
            },
            legend: {
              font: { color: '#cbd5e1', size: 11 },
              orientation: 'h',
              y: 0.95,
              x: 0.05,
            },
          };

          const config: any = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
          };

          await Plotly.react(container, traces, layout, config);
        }

        // Handle Click Event on Plotly points
        (container as any).removeAllListeners?.('plotly_click');
        (container as any).on?.('plotly_click', (eventData: any) => {
          if (eventData?.points?.[0]?.customdata) {
            const clicked = eventData.points[0].customdata as Individual;
            onSelectSolution(clicked);
          }
        });
      } catch (err) {
        console.error('Error rendering Plotly chart:', err);
      }
    }

    renderPlot();

    return () => {
      isCancelled = true;
    };
  }, [activeView, solutions, selectedSolution, presetA, presetB, presetC, onSelectSolution]);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Trực quan hóa Không gian Pareto (Pareto Front Visualization)
          </h2>
          <p className="text-xs text-slate-400">
            Click vào bất kỳ điểm nào trên biểu đồ để xem chi tiết 18 đoạn cống tương ứng
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView('cost-life')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'cost-life'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            2D: Chi phí vs Tuổi thọ
          </button>

          <button
            onClick={() => setActiveView('cost-traffic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'cost-traffic'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            2D: Chi phí vs Giao thông
          </button>

          <button
            onClick={() => setActiveView('3d-pareto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === '3d-pareto'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            3D: Mặt Pareto 3 Chiều
          </button>
        </div>
      </div>

      {/* Currently Selected Solution Quick Bar */}
      {selectedSolution && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-slate-300">Đang chọn nghiệm:</span>
            <span className="font-bold text-white font-mono">{selectedSolution.id}</span>
            {selectedSolution.isPreset && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                Phương án {selectedSolution.isPreset}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>
              Chi phí: <strong className="text-emerald-400">{selectedSolution.costBillion.toFixed(3)} tỷ VNĐ</strong>
            </span>
            <span>
              Tuổi thọ: <strong className="text-cyan-400">{selectedSolution.lifespan} năm</strong>
            </span>
            <span>
              Giao thông: <strong className="text-amber-400">{selectedSolution.traffic} xe/h</strong>
            </span>
          </div>
        </div>
      )}

      {/* Plotly Canvas Container */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div>
          💡 <em>Mẹo:</em> Dùng chuột để xoay (đối với 3D), kéo phóng to hoặc nhấp đúp để đặt lại tầm nhìn.
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            ★ Điểm A (Min Chi phí)
          </span>
          <span className="inline-flex items-center gap-1 text-blue-400">
            ★ Điểm B (Max Tuổi thọ)
          </span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            ★ Điểm C (Min Tắc đường)
          </span>
        </div>
      </div>
    </div>
  );
};
