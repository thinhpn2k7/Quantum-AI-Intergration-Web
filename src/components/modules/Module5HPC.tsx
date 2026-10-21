import React, { useState } from 'react';
import { Cpu, Atom, Cloud, Zap, Activity } from 'lucide-react';
import { computeVQEHydrogen } from '../../lib/quantumEngine';

export const Module5HPC: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vqe' | 'cuquantum' | 'cloud'>('vqe');

  // VQE Simulation State
  const [bondDistanceR, setBondDistanceR] = useState<number>(0.74); // Equilibrium bond length ~0.74 Angstroms
  const [variationalTheta, setVariationalTheta] = useState<number>(Math.PI * 0.92);

  const vqeResults = computeVQEHydrogen(bondDistanceR, variationalTheta);

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>Module 05</span>
          <span>·</span>
          <span>Heterogeneous Quantum-Classical HPC</span>
          <span>·</span>
          <span>NVIDIA cuQuantum & Cloud QPUs</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Hybrid Quantum-Classical & HPC Integration: VQE & GPU Acceleration
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Quantum processors operate as high-specialization Coprocessors (QPUs) tightly coupled with classical CPU/GPU supercomputing nodes. Discover the Variational Quantum Eigensolver (VQE) for molecular chemistry, harness NVIDIA cuQuantum SDK for GPU-accelerated simulation, and explore cloud hardware deployment topologies.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'vqe', label: '1. VQE Molecular Chemistry Lab', icon: Atom },
            { id: 'cuquantum', label: '2. NVIDIA cuQuantum Architecture', icon: Cpu },
            { id: 'cloud', label: '3. Cloud QPU Deployment', icon: Cloud },
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

      {/* Tab 1: VQE Molecular Chemistry */}
      {activeTab === 'vqe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">H₂ Molecule VQE Simulation</h3>
                <span className="text-[11px] font-mono text-cyan-400">Jordan-Wigner 2-Qubit</span>
              </div>

              {/* Bond Distance Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Interatomic Distance (R)</span>
                  <span className="text-cyan-400 font-semibold">{bondDistanceR.toFixed(2)} Å</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.02"
                  value={bondDistanceR}
                  onChange={(e) => setBondDistanceR(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>Repulsive (0.3 Å)</span>
                  <span className="text-emerald-400 font-semibold">Equilibrium (~0.74 Å)</span>
                  <span>Dissociated (2.5 Å)</span>
                </div>
              </div>

              {/* Variational Angle Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Ansatz Parameter θ</span>
                  <span className="text-violet-400 font-semibold">
                    {((variationalTheta * 180) / Math.PI).toFixed(1)}° ({(variationalTheta / Math.PI).toFixed(2)}π)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.PI}
                  step="0.02"
                  value={variationalTheta}
                  onChange={(e) => setVariationalTheta(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
              </div>

              {/* Auto-Optimize Button */}
              <button
                type="button"
                onClick={() => setVariationalTheta(Math.PI * 0.92)}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Converge to Ground State Energy</span>
              </button>

              {/* Numerical Output Table */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">VQE Energy ⟨H⟩</span>
                  <span className="text-sm font-bold text-cyan-300 tabular-nums">
                    {vqeResults.energyHartree.toFixed(5)} Ha
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Exact FCI Energy</span>
                  <span className="text-sm font-bold text-emerald-300 tabular-nums">
                    {vqeResults.exactFCI.toFixed(5)} Ha
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Expectation ⟨Z₀⟩</span>
                  <span className="text-xs font-medium text-slate-200 tabular-nums">
                    {vqeResults.expectationZ0.toFixed(4)}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Expectation ⟨Z₁⟩</span>
                  <span className="text-xs font-medium text-slate-200 tabular-nums">
                    {vqeResults.expectationZ1.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Potential Energy Surface (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Potential Energy Surface (Morse Potential Ground State)
              </h3>

              <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg space-y-3">
                {/* SVG Curve of Energy vs R */}
                <div className="h-48 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 180">
                    {/* Coordinate axes */}
                    <line x1="40" y1="20" x2="40" y2="160" stroke="#334155" strokeWidth="1" />
                    <line x1="40" y1="160" x2="380" y2="160" stroke="#334155" strokeWidth="1" />
                    
                    {/* Energy Zero reference line */}
                    <line x1="40" y1="60" x2="380" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                    <text x="15" y="64" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">-1.0 Ha</text>
                    <text x="15" y="140" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">-1.2 Ha</text>
                    <text x="350" y="174" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">R (Å)</text>

                    {/* Theoretical potential energy curve */}
                    <path
                      d="M 50 30 Q 90 220, 150 140 T 360 100"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2"
                    />

                    {/* Current VQE evaluated point */}
                    {(() => {
                      // Map R from [0.3, 2.5] to canvas X [50, 360]
                      const ptX = 50 + ((bondDistanceR - 0.3) / 2.2) * 310;
                      // Map energy from [-1.2, -0.9] to canvas Y [150, 40]
                      const ptY = 150 - ((vqeResults.energyHartree - (-1.2)) / 0.3) * 110;
                      return (
                        <g>
                          <circle cx={ptX} cy={ptY} r="6" fill="#22d3ee" className="animate-pulse" />
                          <circle cx={ptX} cy={ptY} r="2" fill="#ffffff" />
                          <line x1={ptX} y1="20" x2={ptX} y2="160" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-300">
                  <div className="text-cyan-300 font-semibold mb-1">Hybrid Co-Design Loop:</div>
                  <div className="text-[11px] text-slate-400">
                    1. Quantum QPU prepares trial state |ψ(θ)⟩ and measures Pauli strings ⟨Z₀⟩, ⟨Z₁⟩, ⟨X₀X₁⟩.<br />
                    2. Classical CPU/GPU optimizer (COBYLA / SLSQP) updates rotation angle θ to minimize ⟨H⟩.<br />
                    3. Repeats until chemical accuracy (|ΔE| &lt; 1.6 × 10⁻³ Ha = 1 kcal/mol) is achieved.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: NVIDIA cuQuantum */}
      {activeTab === 'cuquantum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">NVIDIA cuQuantum SDK Components</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="p-3 rounded bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block font-mono">1. cuStateVec (Statevector Pipeline):</strong>
                Accelerates gate-level circuit simulation via batched multi-qubit tensor contractions across NVIDIA Hopper/Blackwell Tensor Cores. Up to 85x faster than CPU single-node BLAS.
              </li>
              <li className="p-3 rounded bg-slate-900 border border-slate-800">
                <strong className="text-violet-300 block font-mono">2. cuTensorNet (Tensor Network Library):</strong>
                Deploys automated contraction path slicing (hyper-graph partitioning) for Matrix Product States (MPS) and PEPS, enabling 100+ qubit simulation for low-entanglement circuits.
              </li>
            </ul>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white font-mono">GPU vs. CPU Benchmark Ratios (36 Qubits)</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Dual-Socket Intel Xeon CPU:</span>
                <span className="text-rose-400 font-bold">124.8 seconds</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">NVIDIA A100 (80GB VRAM):</span>
                <span className="text-cyan-300 font-bold">3.20 seconds (39x)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">NVIDIA H100 (NVLink Switch):</span>
                <span className="text-emerald-300 font-bold">1.46 seconds (85x)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 leading-relaxed">
              Supercomputers like Perlmutter (NERSC) and Leonardo deploy cuQuantum to validate quantum algorithms prior to dispatching them to cryogenic quantum hardware.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Cloud QPU Deployment */}
      {activeTab === 'cloud' && (
        <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white font-mono">Cloud Quantum Hardware Orchestration</h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Leading quantum software stacks submit compilation jobs via asynchronous REST/gRPC endpoints to cryogenic dilution refrigerators operating at ~15 millikelvin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-cyan-400 font-bold block text-sm">IBM Quantum Platform</span>
              <span className="text-slate-400 text-[11px] block">Eagle (127Q) & Heron (133Q)</span>
              <p className="text-slate-300 text-[11px] pt-1">
                Fixed-frequency transmon qubits with tunable cross-resonance couplers; native Qiskit Runtime Primitives (Sampler V2 / Estimator V2).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-violet-400 font-bold block text-sm">Amazon Braket</span>
              <span className="text-slate-400 text-[11px] block">IonQ Forte (Trapped Ion) & Rigetti</span>
              <p className="text-slate-300 text-[11px] pt-1">
                Multi-technology marketplace featuring all-to-all connectivity on trapped Ytterbium ions and superconducting lattices.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-bold block text-sm">Azure Quantum</span>
              <span className="text-slate-400 text-[11px] block">Quantinuum (H1/H2) & Q#</span>
              <p className="text-slate-300 text-[11px] pt-1">
                Shuttling trapped-ion architecture with industry-record two-qubit gate fidelities exceeding 99.9% and in-sequence mid-circuit measurement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
