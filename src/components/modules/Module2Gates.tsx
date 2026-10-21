import React, { useState } from 'react';
import { GateStep, GateType } from '../../types/quantum';
import { Plus, Trash2, Play, ShieldAlert, Cpu } from 'lucide-react';

interface Module2GatesProps {
  numQubits: number;
  gates: GateStep[];
  onAddGate: (gate: GateStep) => void;
  onRemoveGate: (id: string) => void;
  onClearGates: () => void;
  onLoadPreset: (preset: 'bell' | 'ghz' | 'teleport' | 'qft') => void;
}

export const Module2Gates: React.FC<Module2GatesProps> = ({
  numQubits,
  gates,
  onAddGate,
  onRemoveGate,
  onClearGates,
  onLoadPreset,
}) => {
  const [selectedGateType, setSelectedGateType] = useState<GateType>('H');
  const [targetQubit, setTargetQubit] = useState<number>(0);
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [rotTheta, setRotTheta] = useState<number>(Math.PI / 4);
  const [activeSection, setActiveSection] = useState<'circuit' | 'nisq_ftqc' | 'surface_code'>('circuit');

  // Surface code syndrome toggles for interactive error demonstration
  const [errorPosition, setErrorPosition] = useState<number | null>(null);

  const singleGates: GateType[] = ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'];
  const multiGates: GateType[] = ['CNOT', 'CZ', 'SWAP'];

  const handleAdd = () => {
    const isMulti = ['CNOT', 'CZ', 'SWAP'].includes(selectedGateType);
    const newGate: GateStep = {
      id: `gate_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: selectedGateType,
      targetQubit,
      controlQubit: isMulti ? controlQubit : undefined,
      theta: ['RX', 'RY', 'RZ'].includes(selectedGateType) ? rotTheta : undefined,
    };
    onAddGate(newGate);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>Module 02</span>
          <span>·</span>
          <span>Quantum Gate Calculus & Architecture</span>
          <span>·</span>
          <span>Fault-Tolerant Surface Codes</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Quantum Computing Fundamentals: Gates, Circuits & Error Correction
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Unitary gates act as complex rotation operators in Hilbert space. Construct quantum circuits, examine non-local 2-qubit entangling gates, and inspect the structural leap from current NISQ processors to Fault-Tolerant Quantum Computing (FTQC) with topological surface codes.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'circuit', label: '1. Interactive Circuit Builder', icon: Cpu },
            { id: 'nisq_ftqc', label: '2. NISQ vs. FTQC Matrix', icon: Play },
            { id: 'surface_code', label: '3. Surface Code Error Correction', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
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

      {/* Section 1: Interactive Circuit Builder */}
      {activeSection === 'circuit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Circuit Controls (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Quantum Gate Deck</h3>
                <span className="text-[11px] font-mono text-slate-400">{numQubits} Qubits Active</span>
              </div>

              {/* Single Qubit Gate Palette */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">Single-Qubit Unitaries</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {singleGates.map((gt) => (
                    <button
                      key={gt}
                      type="button"
                      onClick={() => setSelectedGateType(gt)}
                      className={`p-2 rounded text-xs font-mono font-bold transition-all ${
                        selectedGateType === gt
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {gt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Qubit Gate Palette */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">Entangling 2-Qubit Gates</span>
                <div className="grid grid-cols-3 gap-2">
                  {multiGates.map((gt) => (
                    <button
                      key={gt}
                      type="button"
                      onClick={() => setSelectedGateType(gt)}
                      className={`p-2 rounded text-xs font-mono font-bold transition-all ${
                        selectedGateType === gt
                          ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {gt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target / Control Qubit Pickers */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Target Qubit</label>
                  <select
                    value={targetQubit}
                    onChange={(e) => setTargetQubit(parseInt(e.target.value, 10))}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {Array.from({ length: numQubits }).map((_, i) => (
                      <option key={i} value={i}>
                        q[{i}]
                      </option>
                    ))}
                  </select>
                </div>

                {['CNOT', 'CZ', 'SWAP'].includes(selectedGateType) && (
                  <div>
                    <label className="text-slate-400 block mb-1">Control Qubit</label>
                    <select
                      value={controlQubit}
                      onChange={(e) => setControlQubit(parseInt(e.target.value, 10))}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      {Array.from({ length: numQubits }).map((_, i) => (
                        <option key={i} value={i} disabled={i === targetQubit}>
                          q[{i}] {i === targetQubit ? '(Target)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Rotation Theta Slider if RX, RY, RZ */}
              {['RX', 'RY', 'RZ'].includes(selectedGateType) && (
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Rotation Angle θ</span>
                    <span className="text-cyan-400 font-semibold">
                      {((rotTheta * 180) / Math.PI).toFixed(1)}° ({(rotTheta / Math.PI).toFixed(2)}π)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.05"
                    value={rotTheta}
                    onChange={(e) => setRotTheta(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Gate</span>
                </button>
                <button
                  type="button"
                  onClick={onClearGates}
                  className="py-2 px-3 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Clear all gates"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Circuit Presets */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2">Circuit Presets</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => onLoadPreset('bell')}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-left transition-colors"
                  >
                    |Φ⁺⟩ Bell State (H + CNOT)
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadPreset('ghz')}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-left transition-colors"
                  >
                    |GHZ⟩ 3-Qubit Entangled
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadPreset('teleport')}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-left transition-colors"
                  >
                    Quantum Teleportation
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadPreset('qft')}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-left transition-colors"
                  >
                    2-Qubit QFT Basis
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical Circuit Visualizer Canvas (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Quantum Circuit Register</h3>
                <span className="text-xs font-mono text-slate-400">Total Gates: {gates.length}</span>
              </div>

              {/* Circuit Timeline Grid */}
              <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg overflow-x-auto min-h-64 flex flex-col justify-around gap-6">
                {Array.from({ length: numQubits }).map((_, qIdx) => {
                  // Find all gates affecting this qubit
                  return (
                    <div key={qIdx} className="relative flex items-center min-w-[500px]">
                      {/* Qubit Label */}
                      <span className="w-16 font-mono text-xs font-bold text-cyan-400 shrink-0">
                        q[{qIdx}] |0⟩
                      </span>

                      {/* Continuous Quantum Wire Line */}
                      <div className="absolute left-16 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700/80 -z-0" />

                      {/* Placed Gates along the wire */}
                      <div className="relative z-10 flex items-center gap-3 pl-4">
                        {gates.map((gate, gIdx) => {
                          const isTarget = gate.targetQubit === qIdx;
                          const isControl = gate.controlQubit === qIdx;

                          if (!isTarget && !isControl) {
                            // Blank spacing placeholder to keep columns aligned
                            return <div key={gate.id} className="w-9 h-9" />;
                          }

                          if (isControl) {
                            // Render control dot (black filled dot with vertical connector line)
                            return (
                              <div
                                key={gate.id}
                                className="w-9 h-9 flex items-center justify-center relative group"
                              >
                                <div className="w-3.5 h-3.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                                <button
                                  type="button"
                                  onClick={() => onRemoveGate(gate.id)}
                                  className="absolute -top-3 -right-2 hidden group-hover:flex w-4 h-4 rounded-full bg-rose-600 text-white items-center justify-center text-[10px]"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          }

                          // Target Gate box
                          return (
                            <div
                              key={gate.id}
                              className="relative group w-9 h-9 rounded bg-[#161f30] border border-cyan-500/80 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shadow-md shadow-cyan-500/10 cursor-pointer hover:bg-cyan-950/60"
                            >
                              <span>{gate.type === 'CNOT' ? '⊕' : gate.type}</span>
                              <button
                                type="button"
                                onClick={() => onRemoveGate(gate.id)}
                                className="absolute -top-2.5 -right-2 hidden group-hover:flex w-4 h-4 rounded-full bg-rose-600 text-white items-center justify-center text-[10px]"
                                title="Delete gate"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}

                        {gates.length === 0 && (
                          <span className="text-slate-400 text-xs font-mono italic pl-4">
                            Ground state wire · Insert gates from palette
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wire Description Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Left-to-right temporal gate execution: |ψ_final⟩ = U_k ... U_2 U_1 |00...0⟩</span>
                <span className="text-cyan-400">Unitary Norm Preserved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: NISQ vs. FTQC Matrix */}
      {activeSection === 'nisq_ftqc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                Current Era
              </span>
              <h3 className="text-sm font-semibold text-white">NISQ (Noisy Intermediate-Scale Quantum)</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Qubit Count:</strong> 50 to 1,000 physical noisy qubits.
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Error Rates:</strong> 2-qubit gate fidelity ~ 99.0% to 99.9% (error rate 10⁻³).
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Coherence Limitations:</strong> Circuit depth strictly bounded by T₁ (relaxation) and T₂ (dephasing) timescales (~100–300 µs).
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Viable Algorithms:</strong> Hybrid shallow-depth algorithms like VQE, QAOA, and error-mitigated QML.
              </li>
            </ul>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
                Target Architecture
              </span>
              <h3 className="text-sm font-semibold text-white">FTQC (Fault-Tolerant Quantum Computing)</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Logical Qubits:</strong> Physical-to-logical ratio ~ 1,000:1 via quantum error correction (QEC).
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Error Rates:</strong> Logical error rate P_L &lt; 10⁻¹², below threshold for billions of gates.
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Syndrome Decoding:</strong> Continuous non-destructive stabilizer measurement loops (e.g. MWPM, Union-Find).
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong>Viable Algorithms:</strong> Full Shor's 2048-bit RSA factorization, exact quantum chemistry, fault-tolerant Grover.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Section 3: Surface Code Error Correction */}
      {activeSection === 'surface_code' && (
        <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono">Distance-3 (d=3) Surface Code Stabilizer Grid</h3>
              <p className="text-xs text-slate-400">
                9 Data Qubits (white circles) + 8 Syndrome Ancillas (green Z-plaquettes & orange X-vertices)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setErrorPosition(errorPosition === null ? 4 : null)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
            >
              {errorPosition === null ? 'Inject Pauli-X Error on Data Qubit 4' : 'Clear Injected Error'}
            </button>
          </div>

          {/* Interactive 2D Surface Code Lattice Diagram */}
          <div className="p-6 bg-[#07090e] border border-slate-800 rounded-lg flex flex-col items-center justify-center">
            <div className="grid grid-cols-5 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              {/* Row 0 */}
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-[10px] font-mono text-white">D0</div>
              <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-[10px] font-mono text-emerald-400">Z1</div>
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-[10px] font-mono text-white">D1</div>
              <div className="w-10 h-10 rounded bg-amber-950/60 border border-amber-500/60 flex items-center justify-center text-[10px] font-mono text-amber-400">X1</div>
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-[10px] font-mono text-white">D2</div>

              {/* Row 1 */}
              <div className="w-10 h-10 rounded bg-amber-950/60 border border-amber-500/60 flex items-center justify-center text-[10px] font-mono text-amber-400">X2</div>
              <div className="w-10 h-10 flex items-center justify-center text-slate-400 font-mono text-xs">┼</div>
              <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-[10px] font-mono text-emerald-400">Z2</div>
              <div className="w-10 h-10 flex items-center justify-center text-slate-400 font-mono text-xs">┼</div>
              <div className="w-10 h-10 rounded bg-amber-950/60 border border-amber-500/60 flex items-center justify-center text-[10px] font-mono text-amber-400">X3</div>

              {/* Row 2 */}
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-[10px] font-mono text-white">D3</div>
              <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-[10px] font-mono text-emerald-400">Z3</div>
              {/* Data Qubit 4 (Center - with error highlight if active) */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                errorPosition === 4
                  ? 'bg-rose-600 border-2 border-rose-300 text-white animate-pulse shadow-lg shadow-rose-600/50'
                  : 'bg-slate-800/80 border border-slate-600 text-white'
              }`}>
                D4
              </div>
              <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-[10px] font-mono text-emerald-400">Z4</div>
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-[10px] font-mono text-white">D5</div>
            </div>

            {errorPosition === 4 && (
              <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Stabilizer Syndrome Triggered: Ancillas Z2 and Z3 detected an eigenvalue flip (-1). Decoder maps minimal weight matching to correct D4!
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
