'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { PresetButtons } from '@/components/PresetButtons';
import { ControlPanel } from '@/components/ControlPanel';
import { ParetoCharts } from '@/components/ParetoCharts';
import { WeightFilter } from '@/components/WeightFilter';
import { SegmentTable } from '@/components/SegmentTable';
import { ResearchModal } from '@/components/ResearchModal';
import { ActiveSolutionBanner } from '@/components/ActiveSolutionBanner';
import {
  AlgorithmParams,
  AlgorithmProgress,
  Individual,
  WeightPreferences,
} from '@/types';
import { DEFAULT_PARAMS } from '@/lib/constants';
import { getPresetIndividuals } from '@/lib/presets';
import { evaluateIndividual } from '@/lib/evaluation';

// Preset Individuals from paper (evaluated once at module level)
const PRESETS = getPresetIndividuals();
const presetA = PRESETS.A;
const presetB = PRESETS.B;
const presetC = PRESETS.C;

export default function HomePage() {
  // Selected solution state (defaults to Preset A)
  const [selectedSolution, setSelectedSolution] = useState<Individual>(presetA);
  const [selectedPresetKey, setSelectedPresetKey] = useState<'A' | 'B' | 'C' | null>('A');

  // Pareto Solutions list
  const [paretoSolutions, setParetoSolutions] = useState<Individual[]>([
    presetA,
    presetB,
    presetC,
  ]);

  // Algorithm Control state
  const [params, setParams] = useState<AlgorithmParams>(DEFAULT_PARAMS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<AlgorithmProgress | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  // MCDA / AHP Weights state
  const [weights, setWeights] = useState<WeightPreferences>({
    costWeight: 33.3,
    lifespanWeight: 33.3,
    trafficWeight: 33.4,
  });

  // Research modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Web Worker Ref
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Instantiate Web Worker client-side once
    try {
      const worker = new Worker(new URL('../workers/nsga2.worker.ts', import.meta.url));
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent) => {
        const data = e.data;
        if (!data) return;

        if (data.type === 'PROGRESS') {
          setProgress(data.progress);
          if (data.progress.sampleFront && data.progress.sampleFront.length > 0) {
            // Enrich with detailed segment calculations
            const enriched = data.progress.sampleFront.map((ind: Individual) =>
              evaluateIndividual(ind.chromosome, ind.id)
            );
            setParetoSolutions([presetA, presetB, presetC, ...enriched]);
          }
        } else if (data.type === 'COMPLETE') {
          setIsRunning(false);
          setElapsedMs(data.elapsedMs);

          const finalEnriched = data.paretoFront.map((ind: Individual) =>
            evaluateIndividual(ind.chromosome, ind.id)
          );

          // Combine with Presets A, B, C for full benchmark comparison
          const combined = [presetA, presetB, presetC, ...finalEnriched];
          setParetoSolutions(combined);

          if (finalEnriched.length > 0) {
            setSelectedSolution(finalEnriched[0]);
            setSelectedPresetKey(null);
          }

          // Confetti celebration on completion
          import('canvas-confetti')
            .then((confetti) => {
              confetti.default({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            })
            .catch(() => {});
        } else if (data.type === 'STOPPED') {
          setIsRunning(false);
        }
      };

      worker.onerror = (err) => {
        console.error('NSGA-II Web Worker error:', err);
        setIsRunning(false);
      };

      return () => {
        worker.terminate();
      };
    } catch (err) {
      console.error('Failed to initialize Web Worker:', err);
    }
  }, []);

  // Handler to Start NSGA-II
  const handleStart = () => {
    if (!workerRef.current) return;
    setIsRunning(true);
    setProgress(null);
    setElapsedMs(0);
    workerRef.current.postMessage({
      type: 'START',
      params,
    });
  };

  // Handler to Stop
  const handleStop = () => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'STOP' });
    setIsRunning(false);
  };

  // Handler to Reset params
  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  // Handler to Select a Preset
  const handleSelectPreset = (key: 'A' | 'B' | 'C') => {
    setSelectedPresetKey(key);
    if (key === 'A') setSelectedSolution(presetA);
    else if (key === 'B') setSelectedSolution(presetB);
    else if (key === 'C') setSelectedSolution(presetC);
  };

  // Handler to Select any Solution on Pareto chart or list
  const handleSelectSolution = (sol: Individual) => {
    // If not already enriched with segment details, evaluate
    const fullSol = sol.segmentDetails ? sol : evaluateIndividual(sol.chromosome, sol.id);
    setSelectedSolution(fullSol);

    if (sol.id === presetA.id) setSelectedPresetKey('A');
    else if (sol.id === presetB.id) setSelectedPresetKey('B');
    else if (sol.id === presetC.id) setSelectedPresetKey('C');
    else setSelectedPresetKey(null);
  };

  const handleScrollToTable = () => {
    document.getElementById('step3-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-slate-800 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Header
          onOpenResearchModal={() => setIsModalOpen(true)}
          paretoCount={paretoSolutions.length}
          isRunning={isRunning}
        />

        {/* Step 1: Decision Options */}
        <section aria-label="Bước 1: Chọn hoặc chạy phương án">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                1
              </span>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                Bước 1: Chọn phương án mẫu hoặc Chạy thuật toán tìm phương án mới
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 Bấm chọn nhanh A, B, C bên dưới hoặc bấm nút &quot;Bắt đầu Chạy NSGA-II&quot;
            </p>
          </div>

          <div className="space-y-4">
            {/* 3 Preset Solutions */}
            <PresetButtons
              selectedPresetKey={selectedPresetKey}
              onSelectPreset={handleSelectPreset}
            />

            {/* Algorithm Control Panel */}
            <ControlPanel
              params={params}
              onChangeParams={setParams}
              isRunning={isRunning}
              progress={progress}
              elapsedMs={elapsedMs}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Step 2: Multi-objective Analysis */}
        <section aria-label="Bước 2: Phân tích Pareto và Lọc trọng số">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                2
              </span>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                Bước 2: Phân tích &amp; Lọc phương án theo nhu cầu (Ngân sách / Độ bền / Giao thông)
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 Bảng 18 cống bên dưới sẽ tự động cập nhật ngay khi bạn click biểu đồ hoặc kéo thanh trượt
            </p>
          </div>

          <div className="space-y-4">
            {/* Pareto Charts (2D and 3D) */}
            <ParetoCharts
              solutions={paretoSolutions}
              selectedSolution={selectedSolution}
              onSelectSolution={handleSelectSolution}
              presetA={presetA}
              presetB={presetB}
              presetC={presetC}
            />

            {/* MCDA / AHP Weight Filter */}
            <WeightFilter
              weights={weights}
              onChangeWeights={setWeights}
              solutions={paretoSolutions}
              onSelectSolution={handleSelectSolution}
              selectedSolutionId={selectedSolution?.id}
            />
          </div>
        </section>

        {/* Step 3: Segment Inspector Table */}
        <section aria-label="Bước 3: Chi tiết 18 đoạn cống">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                3
              </span>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                Bước 3: Bản kế hoạch chi tiết cho 18 đoạn cống thi công
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              💡 Kế hoạch cụ thể cho từng đoạn cống (loại ống, cách đào hay ngầm, đơn giá, chi phí)
            </p>
          </div>

          <SegmentTable solution={selectedSolution} />
        </section>

        {/* Floating Active Solution Banner */}
        <ActiveSolutionBanner
          solution={selectedSolution}
          onScrollToTable={handleScrollToTable}
        />

        {/* Research Modal */}
        <ResearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-700">
            Hệ thống Quản lý &amp; Tối ưu hóa Cải tạo Mạng lưới Thoát nước Đô thị
          </p>
          <p className="mt-1 text-slate-500">
            Mô hình toán học NSGA-II và bộ thông số thực nghiệm đối chiếu theo bài báo khoa học của Đặng Minh Hải (2018), Tạp chí KH&amp;KT Thủy lợi và Môi trường.
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Được triển khai Client-side Web Worker • Hỗ trợ xuất báo cáo tĩnh (Static Export)
          </p>
        </footer>
      </div>
    </main>
  );
}
