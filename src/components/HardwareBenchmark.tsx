import React, { useState } from 'react';
import { getBenchmarkMetrics } from '../lib/quantumEngine';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export const HardwareBenchmark: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'ram' | 'time'>('ram');
  const [selectedQubits, setSelectedQubits] = useState<number>(36);

  const testQubitList = [10, 20, 28, 34, 40, 46, 50, 56];
  const metrics = getBenchmarkMetrics(selectedQubits);

  return (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="px-5 py-4 bg-[#0e1424] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Hardware Performance Benchmarking: Quantum vs. Classical Limits
          </span>
          <span className="text-xs font-mono text-slate-400 block mt-0.5">
            Empirical runtime & memory footprint scaling across the 2ⁿ exponential barrier
          </span>
        </div>

        <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMetric('ram')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'ram'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RAM Footprint (2ⁿ)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('time')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'time'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Runtime Speedup (O(√N))
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* Dynamic Qubit Scrubber */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-300">Target Quantum Register Width</span>
            <span className="text-cyan-400 font-bold text-sm">{selectedQubits} Qubits</span>
          </div>
          <input
            type="range"
            min="10"
            max="56"
            value={selectedQubits}
            onChange={(e) => setSelectedQubits(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>10 Qubits (Laptop OK)</span>
            <span>34 Qubits (Workstation 256GB)</span>
            <span>46 Qubits (Exascale Supercomputer Wall)</span>
            <span>56 Qubits (Physical QPU only)</span>
          </div>
        </div>

        {/* Metric 1: RAM Scaling comparison */}
        {activeMetric === 'ram' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Statevector Size</span>
                <span className="text-lg font-bold text-slate-100">
                  2^{selectedQubits}
                </span>
                <span className="text-slate-400 block text-[11px]">
                  {metrics.stateVectorSize.toExponential(3)} complex amplitudes
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Classical RAM Footprint</span>
                <span className={`text-lg font-bold ${metrics.ramGB >= 1024 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {metrics.ramGB >= 1048576
                    ? `${(metrics.ramGB / 1048576).toFixed(2)} PB`
                    : metrics.ramGB >= 1024
                    ? `${(metrics.ramGB / 1024).toFixed(2)} TB`
                    : metrics.ramGB >= 1
                    ? `${metrics.ramGB.toFixed(2)} GB`
                    : `${metrics.ramMB.toFixed(2)} MB`}
                </span>
                <span className="text-slate-400 block text-[11px]">
                  16 bytes per double-precision amplitude
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Physical QPU Hardware</span>
                <span className="text-lg font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {selectedQubits} Qubits
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Requires 0 MB classical memory in superposition
                </span>
              </div>
            </div>

            {/* Classical Simulation Wall Table */}
            <div className="border border-slate-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0e1424] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Qubits (n)</th>
                    <th className="p-3">State Dimension (2ⁿ)</th>
                    <th className="p-3">Classical RAM Required</th>
                    <th className="p-3">Feasibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-[#07090e]">
                  {testQubitList.map((q) => {
                    const m = getBenchmarkMetrics(q);
                    const isSelected = selectedQubits === q;
                    return (
                      <tr
                        key={q}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-950/40' : 'hover:bg-slate-900/40'
                        }`}
                        onClick={() => setSelectedQubits(q)}
                      >
                        <td className="p-3 font-bold text-cyan-300">n = {q}</td>
                        <td className="p-3 text-slate-300">{m.stateVectorSize.toExponential(2)}</td>
                        <td className="p-3 font-semibold text-slate-200">
                          {m.ramGB >= 1048576
                            ? `${(m.ramGB / 1048576).toFixed(1)} Petabytes`
                            : m.ramGB >= 1024
                            ? `${(m.ramGB / 1024).toFixed(1)} Terabytes`
                            : m.ramGB >= 1
                            ? `${m.ramGB.toFixed(1)} Gigabytes`
                            : `${m.ramMB.toFixed(1)} Megabytes`}
                        </td>
                        <td className="p-3">
                          {q <= 30 ? (
                            <span className="text-emerald-400 font-semibold">Standard PC / Laptop</span>
                          ) : q <= 40 ? (
                            <span className="text-cyan-400 font-semibold">HPC GPU Node (NVIDIA A100/H100)</span>
                          ) : q <= 46 ? (
                            <span className="text-amber-400 font-semibold">Exascale Supercomputer Limit</span>
                          ) : (
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Physical Quantum Processor Required
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Metric 2: Runtime Speedup comparison */}
        {activeMetric === 'time' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Classical Brute Force O(N)</span>
                <span className="text-lg font-bold text-rose-300">
                  {metrics.classicalSimTimeSec < 0.001
                    ? `${(metrics.classicalSimTimeSec * 1000).toFixed(2)} ms`
                    : metrics.classicalSimTimeSec > 3600
                    ? `${(metrics.classicalSimTimeSec / 3600).toFixed(1)} hours`
                    : `${metrics.classicalSimTimeSec.toFixed(2)} sec`}
                </span>
                <span className="text-slate-400 block text-[11px]">Sequential linear traversal</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">cuQuantum GPU Tensor Core</span>
                <span className="text-lg font-bold text-cyan-300">
                  {metrics.cuQuantumGpuTimeSec < 0.001
                    ? `${(metrics.cuQuantumGpuTimeSec * 1000).toFixed(2)} ms`
                    : `${metrics.cuQuantumGpuTimeSec.toFixed(2)} sec`}
                </span>
                <span className="text-emerald-400 block text-[11px]">
                  ~{metrics.cuQuantumSpeedup.toFixed(0)}x hardware acceleration
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Native Quantum Execution O(√N)</span>
                <span className="text-lg font-bold text-emerald-300">
                  {(metrics.qpuNativeTimeSec * 1e6).toFixed(2)} μs
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Quadratic Grover speedup on physical QPU
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg text-xs font-mono text-slate-300 space-y-2">
              <span className="font-semibold text-cyan-300 block">The Quantum Scaling Frontier</span>
              <p className="leading-relaxed text-slate-400">
                While classical GPU simulators using NVIDIA cuQuantum accelerate tensor contractions up to ~40 qubits, they ultimately scale exponentially: \(O(2^n)\). A fault-tolerant quantum computer scales with polynomial circuit depth \(O(n^k)\), unlocking algorithmic feasibility for cryptanalysis, molecular simulation, and combinatorial optimization that classical physics cannot compute.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
