import React, { useState, useMemo } from 'react';
import { ModuleId, GateStep } from './types/quantum';
import { runCircuit, getProbabilities, getQubitBlochCoordinates, measureState } from './lib/quantumEngine';
import { Navigation } from './components/Navigation';
import { BlochSphere3D } from './components/visualizers/BlochSphere3D';
import { ProbabilityHistogram } from './components/visualizers/ProbabilityHistogram';
import { CodeSynchronizer } from './components/CodeSynchronizer';
import { HardwareBenchmark } from './components/HardwareBenchmark';
import { Module1Physics } from './components/modules/Module1Physics';
import { Module2Gates } from './components/modules/Module2Gates';
import { Module3QML } from './components/modules/Module3QML';
import { Module4Optimization } from './components/modules/Module4Optimization';
import { Module5HPC } from './components/modules/Module5HPC';
import { Cpu, Terminal, BarChart2, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('physics');
  const [numQubits, setNumQubits] = useState<number>(3);
  const [inspectedQubit, setInspectedQubit] = useState<number>(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [showBenchmarkTab, setShowBenchmarkTab] = useState<boolean>(false);

  // Initial canonical Bell State circuit: H on q[0], CNOT with ctrl=0 target=1
  const [gates, setGates] = useState<GateStep[]>([
    { id: 'init_h', type: 'H', targetQubit: 0 },
    { id: 'init_cx', type: 'CNOT', controlQubit: 0, targetQubit: 1 },
  ]);

  const [measuredState, setMeasuredState] = useState<number | null>(null);

  // Re-simulate statevector whenever circuit gates or qubit count change
  const statevector = useMemo(() => {
    return runCircuit(numQubits, gates);
  }, [numQubits, gates]);

  const probabilities = useMemo(() => {
    return getProbabilities(statevector);
  }, [statevector]);

  // Extract Bloch sphere coordinates for currently inspected qubit via partial trace
  const blochCoords = useMemo(() => {
    return getQubitBlochCoordinates(statevector, numQubits, inspectedQubit);
  }, [statevector, numQubits, inspectedQubit]);

  // Gate manipulation handlers
  const handleAddGate = (gate: GateStep) => {
    setGates((prev) => [...prev, gate]);
    setMeasuredState(null);
  };

  const handleRemoveGate = (id: string) => {
    setGates((prev) => prev.filter((g) => g.id !== id));
    setMeasuredState(null);
  };

  const handleClearGates = () => {
    setGates([]);
    setMeasuredState(null);
  };

  const handleLoadPreset = (preset: 'bell' | 'ghz' | 'teleport' | 'qft') => {
    setMeasuredState(null);
    if (preset === 'bell') {
      setGates([
        { id: `g_${Date.now()}_1`, type: 'H', targetQubit: 0 },
        { id: `g_${Date.now()}_2`, type: 'CNOT', controlQubit: 0, targetQubit: 1 },
      ]);
    } else if (preset === 'ghz') {
      setGates([
        { id: `g_${Date.now()}_1`, type: 'H', targetQubit: 0 },
        { id: `g_${Date.now()}_2`, type: 'CNOT', controlQubit: 0, targetQubit: 1 },
        { id: `g_${Date.now()}_3`, type: 'CNOT', controlQubit: 1, targetQubit: 2 },
      ]);
    } else if (preset === 'teleport') {
      setGates([
        { id: `g_${Date.now()}_1`, type: 'H', targetQubit: 1 },
        { id: `g_${Date.now()}_2`, type: 'CNOT', controlQubit: 1, targetQubit: 2 },
        { id: `g_${Date.now()}_3`, type: 'CNOT', controlQubit: 0, targetQubit: 1 },
        { id: `g_${Date.now()}_4`, type: 'H', targetQubit: 0 },
      ]);
    } else if (preset === 'qft') {
      setGates([
        { id: `g_${Date.now()}_1`, type: 'H', targetQubit: 0 },
        { id: `g_${Date.now()}_2`, type: 'RZ', targetQubit: 0, theta: Math.PI / 2 },
        { id: `g_${Date.now()}_3`, type: 'H', targetQubit: 1 },
        { id: `g_${Date.now()}_4`, type: 'SWAP', controlQubit: 0, targetQubit: 1 },
      ]);
    }
  };

  const handleMeasure = () => {
    const outcome = measureState(probabilities);
    setMeasuredState(outcome);
  };

  const handleResetMeasurement = () => {
    setMeasuredState(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Navigation
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setShowBenchmarkTab(false);
        }}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Module Sub-bar & Qubit Register Configuration */}
        <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Active Simulation Register
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {numQubits} Qubits ({1 << numQubits} Hilbert Dimensions)
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-mono text-cyan-400">
                  Inspecting q[{inspectedQubit}] on Bloch Sphere
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Qubit Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-2">Qubits:</span>
              {[2, 3, 4].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setNumQubits(q);
                    if (inspectedQubit >= q) setInspectedQubit(q - 1);
                    setMeasuredState(null);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    numQubits === q
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q}Q
                </button>
              ))}
            </div>

            {/* Target Inspected Qubit Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 px-2">Sphere:</span>
              {Array.from({ length: numQubits }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInspectedQubit(idx)}
                  className={`px-2 py-1 rounded transition-colors ${
                    inspectedQubit === idx
                      ? 'bg-violet-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  q[{idx}]
                </button>
              ))}
            </div>

            {/* Toggle Hardware Benchmarks View */}
            <button
              type="button"
              onClick={() => setShowBenchmarkTab(!showBenchmarkTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                showBenchmarkTab
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showBenchmarkTab ? 'Close Benchmarks' : 'Hardware Benchmarks'}</span>
            </button>
          </div>
        </div>

        {/* Optional Benchmarking Overlay View */}
        {showBenchmarkTab && (
          <div className="mb-6">
            <HardwareBenchmark />
          </div>
        )}

        {/* Active Module Content */}
        {!showBenchmarkTab && (
          <>
            {activeModule === 'physics' && <Module1Physics />}
            {activeModule === 'circuits' && (
              <Module2Gates
                numQubits={numQubits}
                gates={gates}
                onAddGate={handleAddGate}
                onRemoveGate={handleRemoveGate}
                onClearGates={handleClearGates}
                onLoadPreset={handleLoadPreset}
              />
            )}
            {activeModule === 'qml' && <Module3QML />}
            {activeModule === 'optimization' && <Module4Optimization />}
            {activeModule === 'hpc' && <Module5HPC />}
          </>
        )}

        {/* Global Live Simulation Stage (Bloch Sphere + Statevector Histogram) */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Real-Time Quantum Execution Engine
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Statevector Evolution: ∑ c_i |i⟩ · Purity: 1.000
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <BlochSphere3D
                theta={blochCoords.theta}
                phi={blochCoords.phi}
                qubitIndex={inspectedQubit}
              />
            </div>

            <div className="lg:col-span-6">
              <ProbabilityHistogram
                numQubits={numQubits}
                statevector={statevector}
                probabilities={probabilities}
                measuredState={measuredState}
                onMeasure={handleMeasure}
                onResetMeasurement={handleResetMeasurement}
              />
            </div>
          </div>
        </div>

        {/* Embedded Code Synchronizer Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Code Synchronizer: Industry Python Scripts
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              IBM Qiskit & Xanadu PennyLane Source
            </span>
          </div>

          <CodeSynchronizer numQubits={numQubits} gates={gates} />
        </div>
      </main>

      {/* Code Synchronizer Modal if opened from top bar */}
      <CodeSynchronizer
        numQubits={numQubits}
        gates={gates}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        isModal={true}
      />

      {/* Editorial Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#07090e] py-8 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Quantum Learning Nexus</span>
            <span>·</span>
            <span>Interactive STEM Quantum Education Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>IBM Qiskit</span>
            <span>·</span>
            <span>Xanadu PennyLane</span>
            <span>·</span>
            <span>NVIDIA cuQuantum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
