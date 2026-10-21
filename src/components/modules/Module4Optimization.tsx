import React, { useState } from 'react';
import { Search, Zap, Network, HardDrive, BarChart3 } from 'lucide-react';
import { getBenchmarkMetrics } from '../../lib/quantumEngine';

export const Module4Optimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grover' | 'shor_qft' | 'qaoa' | 'memory_wall'>('grover');

  // Grover search state
  const [groverN, setGroverN] = useState<number>(64);
  const optimalSteps = Math.round((Math.PI / 4) * Math.sqrt(groverN));
  const [groverStep, setGroverStep] = useState<number>(optimalSteps);

  // Grover target probability calculation
  const thetaAngle = 2 * Math.asin(1 / Math.sqrt(groverN));
  const currentAngle = (2 * groverStep + 1) * (thetaAngle / 2);
  const targetProbability = Math.pow(Math.sin(currentAngle), 2);

  // Memory wall calculator state
  const [benchQubits, setBenchQubits] = useState<number>(30);
  const benchData = getBenchmarkMetrics(benchQubits);

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>Module 04</span>
          <span>·</span>
          <span>Algorithmic Supremacy & Complexity Theory</span>
          <span>·</span>
          <span>Polynomial vs Exponential Speedup</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Quantum Optimization & Performance Metrics: Grover, Shor & QAOA
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Quantum algorithms harness constructive interference to amplify correct solutions while destructively canceling incorrect ones. Examine quadratic search acceleration (O(√N)), exponential period-finding via the Quantum Fourier Transform (QFT), and the physical impossibility of classical statevector simulation beyond 50 qubits.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'grover', label: "1. Grover's Search (O(√N))", icon: Search },
            { id: 'shor_qft', label: "2. Shor's Algorithm & QFT", icon: Zap },
            { id: 'qaoa', label: '3. QAOA (Combinatorial Max-Cut)', icon: Network },
            { id: 'memory_wall', label: '4. The 2ⁿ State Space Wall', icon: HardDrive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Grover's Search */}
      {activeTab === 'grover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Grover Search Space Controls</h3>

              {/* Database Size Picker */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Unstructured Database Size (N = 2ⁿ)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[16, 64, 256, 1024].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setGroverN(size);
                        const opt = Math.round((Math.PI / 4) * Math.sqrt(size));
                        setGroverStep(opt);
                      }}
                      className={`p-2 rounded text-center transition-colors ${
                        groverN === size
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      N = {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Iteration Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Grover Iterations (Oracle + Diffusion)</span>
                  <span className="text-cyan-400 font-semibold">
                    Step {groverStep} / Optimal ~{optimalSteps}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={optimalSteps * 2}
                  value={groverStep}
                  onChange={(e) => setGroverStep(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0 (Superposition)</span>
                  <span className="text-emerald-400 font-semibold">Peak Fidelity (k*)</span>
                  <span>Over-rotation</span>
                </div>
              </div>

              {/* Amplification Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Target Probability</span>
                  <span className="text-lg font-bold text-cyan-300 tabular-nums">
                    {(targetProbability * 100).toFixed(1)} %
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Classical Queries</span>
                  <span className="text-lg font-bold text-rose-300 tabular-nums">
                    N/2 = {groverN / 2}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#0e1424] border border-slate-800 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-cyan-300 block font-mono">The Mathematical Edge: O(√N)</span>
                <p className="text-slate-300 leading-relaxed">
                  In an unstructured list of N = 10⁸ items, a classical computer requires 50,000,000 queries on average. Grover&apos;s algorithm identifies the target with certainty in only (π/4)√(10⁸) ≈ 7,854 oracle evaluations.
                </p>
              </div>
            </div>
          </div>

          {/* Graphical Inversion-About-Average Visualizer (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Amplitude Inversion About the Mean (Diffusion Operator)
              </h3>

              <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg space-y-4">
                {/* Visual Bar of Target vs Non-Target items */}
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="text-cyan-400 font-bold">Target State |ω⟩ (Marked Element)</span>
                      <span className="text-cyan-300 font-semibold tabular-nums">
                        {(targetProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-300 shadow-md shadow-cyan-400/30"
                        style={{ width: `${Math.max(targetProbability * 100, 1)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Remaining {groverN - 1} Non-Target States (Unmarked)</span>
                      <span className="tabular-nums">
                        {((1 - targetProbability) * 100).toFixed(1)}% (Total)
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-700 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max((1 - targetProbability) * 100, 1)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Operator Equation Box */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-cyan-300 font-semibold">Grover Step Iteration Matrix: G = (2|s⟩⟨s| - I) · O_ω</div>
                  <div className="text-slate-400 text-[11px]">
                    1. Oracle O_ω: Flips phase of target state |ω⟩ → -|ω⟩
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    2. Diffusion: Reflects all amplitudes across the mean amplitude ⟨α⟩
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Shor's & QFT */}
      {activeTab === 'shor_qft' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white">Shor&apos;s Factoring Algorithm: O((log N)³)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Shor&apos;s algorithm reduces the problem of integer factorization to order-finding: determining the period r of the modular exponentiation function f(x) = a^x mod N.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
              <div>Classical Best (GNFS): exp(O((log N)^(1/3) (log log N)^(2/3)))</div>
              <div className="text-emerald-300">Shor&apos;s Quantum Runtime: O((log N)³) (Polynomial!)</div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Factorization of a 2048-bit RSA key would require billions of years on the Fugaku supercomputer, but only ~8 hours on a fault-tolerant quantum computer running ~4,000 logical qubits.
            </p>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white">Quantum Fourier Transform (QFT) Architecture</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The QFT maps computational basis states |j⟩ into frequency eigenstates in time O(n²), compared to classical Fast Fourier Transform (FFT) taking O(n 2ⁿ):
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-violet-300">
              |j⟩ → (1/√N) ∑_{`{k=0}`}^N-1 exp(2πi jk / N) |k⟩
            </div>
            <p className="text-xs text-slate-400">
              Composed entirely of Hadamard gates, controlled phase rotators R_k = diag(1, exp(2πi/2^k)), and reverse swap gates.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: QAOA */}
      {activeTab === 'qaoa' && (
        <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white font-mono">
            Quantum Approximate Optimization Algorithm (QAOA)
          </h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            QAOA solves NP-hard combinatorial optimization problems (e.g. Max-Cut on graphs, Traveling Salesperson, Portfolio Optimization) on NISQ devices using shallow alternating Hamiltonians:
          </p>
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-cyan-300">
            |γ, β⟩ = ∏_{`{p=1}`}^P [ exp(-i β_p H_M) exp(-i γ_p H_C) ] |+⟩^{`{⊗n}`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">Cost Hamiltonian H_C:</span>
              Encodes the graph cut objective: H_C = ∑ 1/2 (I - Z_i Z_j).
            </div>
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-violet-400 font-bold block mb-1">Mixer Hamiltonian H_M:</span>
              Drives quantum tunneling between configurations: H_M = ∑ X_i.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 2^n State Space & Memory Wall */}
      {activeTab === 'memory_wall' && (
        <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white font-mono">The 2ⁿ State Space & Classical Memory Wall</h3>
            <p className="text-xs text-slate-400">
              Simulating n qubits on a classical computer requires storing 2ⁿ double-precision complex amplitudes (16 bytes each).
            </p>
          </div>

          {/* Interactive Qubit Slider */}
          <div className="max-w-xl space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Qubit Count (n)</span>
              <span className="text-cyan-400 font-semibold">{benchQubits} Qubits</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={benchQubits}
              onChange={(e) => setBenchQubits(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Benchmark Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Statevector Dimension</span>
              <span className="text-sm font-bold text-slate-200">
                2^{benchQubits} = {benchData.stateVectorSize.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Classical RAM Required</span>
              <span className={`text-sm font-bold ${benchData.isClassicalWall ? 'text-rose-400' : 'text-cyan-300'}`}>
                {benchData.ramGB >= 1 ? `${benchData.ramGB.toFixed(2)} GB` : `${benchData.ramMB.toFixed(2)} MB`}
              </span>
              {benchData.ramGB >= 1024 && (
                <span className="text-[10px] text-rose-400 block">
                  ({(benchData.ramGB / 1024).toFixed(1)} Terabytes!)
                </span>
              )}
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">cuQuantum GPU Time</span>
              <span className="text-sm font-bold text-violet-300">
                {benchData.cuQuantumGpuTimeSec < 0.001
                  ? `${(benchData.cuQuantumGpuTimeSec * 1000).toFixed(2)} ms`
                  : `${benchData.cuQuantumGpuTimeSec.toFixed(2)} sec`}
              </span>
              <span className="text-[10px] text-emerald-400 block">
                {benchData.cuQuantumSpeedup.toFixed(0)}x Tensor Core Speedup
              </span>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Physical QPU Hardware</span>
              <span className="text-sm font-bold text-emerald-300">
                {benchQubits} Physical Qubits
              </span>
              <span className="text-[10px] text-slate-400 block">Zero Memory Wall!</span>
            </div>
          </div>

          {benchData.isClassicalWall && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300">
              ⚠️ Classical Supercomputer Simulation Wall Exceeded: At n &gt; 45 qubits, statevector simulation requires multiple Petabytes of RAM, exceeding the physical memory of the world&apos;s fastest exascale supercomputers (Frontier, Aurora). Quantum hardware computes natively in physical Hilbert space.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
