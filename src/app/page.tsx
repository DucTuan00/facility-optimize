'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { PresetButtons } from '@/components/PresetButtons';
import { ControlPanel } from '@/components/ControlPanel';
import { ParetoCharts } from '@/components/ParetoCharts';
import { WeightFilter } from '@/components/WeightFilter';
import { SegmentTable } from '@/components/SegmentTable';
import { ResearchModal } from '@/components/ResearchModal';
import {
  AlgorithmParams,
  AlgorithmProgress,
  Individual,
  WeightPreferences,
} from '@/types';
import { DEFAULT_PARAMS } from '@/lib/constants';
import { getPresetIndividuals } from '@/lib/presets';
import { evaluateIndividual } from '@/lib/evaluation';

export default function HomePage() {
  // Preset Individuals from paper
  const { A: presetA, B: presetB, C: presetC } = getPresetIndividuals();

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
    // Instantiate Web Worker client-side
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
  }, [presetA, presetB, presetC]);

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

  return (
    <main className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          onOpenResearchModal={() => setIsModalOpen(true)}
          paretoCount={paretoSolutions.length}
          isRunning={isRunning}
        />

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
        />

        {/* Segment Inspector Table */}
        <SegmentTable solution={selectedSolution} />

        {/* Research Modal */}
        <ResearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>
            Mô hình Tối ưu hóa Đa mục tiêu Cải tạo Hệ thống Thoát nước TP. Sầm Sơn, Thanh Hóa • Ứng dụng giải thuật NSGA-II
          </p>
          <p className="mt-1 text-slate-600">
            Dựa trên công trình nghiên cứu của Đặng Minh Hải (2018), Tạp chí Khoa học Kỹ thuật Thủy lợi và Môi trường. Xây dựng bằng Next.js (App Router), TypeScript, Tailwind CSS và Web Worker Client-side.
          </p>
        </footer>
      </div>
    </main>
  );
}
