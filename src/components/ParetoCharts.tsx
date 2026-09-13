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
        if (isCancelled || !chartContainerRef.current) return;

        const container = chartContainerRef.current;
        const paretoPoints = solutions.length > 0 ? solutions : [presetA, presetB, presetC];

        if (activeView === 'cost-life') {
          // 2D: Chi phí (Trục X) vs Tuổi thọ (Trục Y), màu theo Giao thông
          const sorted = [...paretoPoints].sort((a, b) => a.costBillion - b.costBillion);

          const traceParetoLine = {
            x: sorted.map((p) => p.costBillion),
            y: sorted.map((p) => p.lifespan),
            mode: 'lines',
            name: 'Đường cong Pareto',
            line: {
              color: '#94a3b8',
              width: 1.5,
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
                `<b>Chi phí C_ct:</b> ${p.costBillion.toFixed(3)} tỷ VNĐ<br>` +
                `<b>Tuổi thọ SL:</b> ${p.lifespan} năm<br>` +
                `<b>Ảnh hưởng GT:</b> ${p.traffic} xe/h`
            ),
            customdata: paretoPoints,
            mode: 'markers',
            name: 'Nghiệm Pareto',
            type: 'scatter',
            marker: {
              size: 9,
              color: paretoPoints.map((p) => p.traffic),
              colorscale: 'Blues',
              colorbar: {
                title: { text: 'GT (xe/h)', font: { color: '#475569', size: 11 } },
                tickfont: { color: '#64748b', size: 10 },
                len: 0.8,
              },
              showscale: true,
              line: { color: '#ffffff', width: 1 },
              opacity: 0.85,
            },
            hoverinfo: 'text',
          };

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
            name: 'Phương án A, B, C',
            textposition: 'top center',
            textfont: { color: '#0f172a', size: 11, family: 'sans-serif' },
            type: 'scatter',
            marker: {
              size: 14,
              symbol: 'diamond',
              color: ['#16a34a', '#2563eb', '#d97706'],
              line: { color: '#ffffff', width: 2 },
            },
            hoverinfo: 'text',
          };

          const traces: any[] = [traceParetoLine, traceParetoPoints, tracePresets];

          if (selectedSolution) {
            traces.push({
              x: [selectedSolution.costBillion],
              y: [selectedSolution.lifespan],
              mode: 'markers',
              name: 'Đang chọn',
              type: 'scatter',
              marker: {
                size: 18,
                symbol: 'circle-open',
                color: '#0f172a',
                line: { color: '#0f172a', width: 2.5 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 60, r: 30, t: 25, b: 50 },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#f8fafc',
            xaxis: {
              title: { text: 'Tổng Chi phí C_ct (Tỷ VNĐ)', font: { color: '#334155', size: 12 } },
              tickfont: { color: '#64748b', size: 10 },
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
            },
            yaxis: {
              title: { text: 'Tuổi thọ trung bình SL (Năm)', font: { color: '#334155', size: 12 } },
              tickfont: { color: '#64748b', size: 10 },
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
            },
            legend: {
              font: { color: '#334155', size: 11 },
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
          // 2D: Chi phí vs Giao thông
          const sorted = [...paretoPoints].sort((a, b) => a.costBillion - b.costBillion);

          const traceParetoLine = {
            x: sorted.map((p) => p.costBillion),
            y: sorted.map((p) => p.traffic),
            mode: 'lines',
            name: 'Đường cong Pareto',
            line: {
              color: '#94a3b8',
              width: 1.5,
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
              size: 9,
              color: paretoPoints.map((p) => p.lifespan),
              colorscale: 'Viridis',
              colorbar: {
                title: { text: 'Tuổi thọ (năm)', font: { color: '#475569', size: 11 } },
                tickfont: { color: '#64748b', size: 10 },
                len: 0.8,
              },
              showscale: true,
              line: { color: '#ffffff', width: 1 },
              opacity: 0.85,
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
            name: 'Phương án A, B, C',
            textposition: 'top center',
            textfont: { color: '#0f172a', size: 11, family: 'sans-serif' },
            type: 'scatter',
            marker: {
              size: 14,
              symbol: 'diamond',
              color: ['#16a34a', '#2563eb', '#d97706'],
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
              name: 'Đang chọn',
              type: 'scatter',
              marker: {
                size: 18,
                symbol: 'circle-open',
                color: '#0f172a',
                line: { color: '#0f172a', width: 2.5 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 60, r: 30, t: 25, b: 50 },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#f8fafc',
            xaxis: {
              title: { text: 'Tổng Chi phí C_ct (Tỷ VNĐ)', font: { color: '#334155', size: 12 } },
              tickfont: { color: '#64748b', size: 10 },
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
            },
            yaxis: {
              title: { text: 'Mức ảnh hưởng Giao thông GT (xe/giờ)', font: { color: '#334155', size: 12 } },
              tickfont: { color: '#64748b', size: 10 },
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
            },
            legend: {
              font: { color: '#334155', size: 11 },
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
          // 3D: Mặt Pareto 3 Chiều
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
              size: 4.5,
              color: paretoPoints.map((p) => p.costBillion),
              colorscale: 'Viridis',
              colorbar: {
                title: { text: 'Chi phí (Tỷ)', font: { color: '#475569', size: 11 } },
                tickfont: { color: '#64748b', size: 10 },
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
            textfont: { color: '#0f172a', size: 11 },
            type: 'scatter3d',
            marker: {
              size: 9,
              color: ['#16a34a', '#2563eb', '#d97706'],
              symbol: 'diamond',
              line: { color: '#ffffff', width: 1.5 },
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
                size: 12,
                color: '#0f172a',
                symbol: 'circle',
                line: { color: '#ffffff', width: 2 },
              },
              hoverinfo: 'skip',
            });
          }

          const layout: any = {
            autosize: true,
            margin: { l: 0, r: 0, t: 0, b: 0 },
            paper_bgcolor: '#ffffff',
            scene: {
              xaxis: {
                title: { text: 'Chi phí (Tỷ)', font: { color: '#334155', size: 11 } },
                tickfont: { color: '#64748b', size: 9 },
                gridcolor: '#e2e8f0',
                backgroundcolor: '#f8fafc',
              },
              yaxis: {
                title: { text: 'Tuổi thọ (Năm)', font: { color: '#334155', size: 11 } },
                tickfont: { color: '#64748b', size: 9 },
                gridcolor: '#e2e8f0',
                backgroundcolor: '#f8fafc',
              },
              zaxis: {
                title: { text: 'Giao thông (xe/h)', font: { color: '#334155', size: 11 } },
                tickfont: { color: '#64748b', size: 9 },
                gridcolor: '#e2e8f0',
                backgroundcolor: '#f8fafc',
              },
              camera: {
                eye: { x: 1.6, y: 1.6, z: 1.3 },
              },
            },
            legend: {
              font: { color: '#334155', size: 11 },
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

        // Click handler
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            Không gian Nghiệm Pareto (Pareto Front Visualization)
          </h2>
          <p className="text-xs text-slate-500">
            Click vào bất kỳ điểm nào trên biểu đồ để xem chi tiết 18 đoạn cống tương ứng
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView('cost-life')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'cost-life'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            2D: Chi phí vs Tuổi thọ
          </button>

          <button
            type="button"
            onClick={() => setActiveView('cost-traffic')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'cost-traffic'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            2D: Chi phí vs Giao thông
          </button>

          <button
            type="button"
            onClick={() => setActiveView('3d-pareto')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === '3d-pareto'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            3D: Mặt Pareto 3 Mục tiêu
          </button>
        </div>
      </div>

      {/* Selected solution info strip */}
      {selectedSolution && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-600">Đang chọn nghiệm:</span>
            <span className="font-bold text-slate-900 font-mono">{selectedSolution.id}</span>
            {selectedSolution.isPreset && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                Phương án mẫu {selectedSolution.isPreset}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>
              Chi phí: <strong className="text-emerald-700 font-mono">{selectedSolution.costBillion.toFixed(3)} tỷ</strong>
            </span>
            <span>
              Tuổi thọ: <strong className="text-sky-700 font-mono">{selectedSolution.lifespan} năm</strong>
            </span>
            <span>
              Giao thông: <strong className="text-amber-700 font-mono">{selectedSolution.traffic} xe/h</strong>
            </span>
          </div>
        </div>
      )}

      {/* Plotly Canvas Container */}
      <div className="relative w-full h-[450px] sm:h-[480px] rounded-lg border border-slate-200 overflow-hidden bg-white">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div>
          💡 <em>Thao tác:</em> Dùng chuột để xoay (biểu đồ 3D), kéo chuột để zoom hoặc nhấp đúp để reset góc nhìn.
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            ◆ Điểm A (Min Chi phí)
          </span>
          <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
            ◆ Điểm B (Max Tuổi thọ)
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            ◆ Điểm C (Min Tắc đường)
          </span>
        </div>
      </div>
    </div>
  );
};
