import React, { useState } from 'react';
import { BlochSphere3D } from '../visualizers/BlochSphere3D';
import { WaveTunnelingCanvas } from '../visualizers/WaveTunnelingCanvas';
import { Sliders, Sparkles, Binary } from 'lucide-react';

interface Module1PhysicsProps {
  onApplyPresetToCircuit?: (presetName: string) => void;
}

export const Module1Physics: React.FC<Module1PhysicsProps> = () => {
  const [activeTab, setActiveTab] = useState<'bloch' | 'tunneling' | 'schrodinger' | 'entanglement'>('bloch');
  const [theta, setTheta] = useState<number>(Math.PI / 2); // 90 deg -> equal superposition |+>
  const [phi, setPhi] = useState<number>(0); // 0 rad
  const [entanglementState, setEntanglementState] = useState<'bell_phi_plus' | 'bell_psi_plus' | 'ghz'>('bell_phi_plus');

  const presetAngles = [
    { label: '|0⟩ Ground State', theta: 0, phi: 0 },
    { label: '|1⟩ Excited State', theta: Math.PI, phi: 0 },
    { label: '|+⟩ Superposition', theta: Math.PI / 2, phi: 0 },
    { label: '|-⟩ Superposition', theta: Math.PI / 2, phi: Math.PI },
    { label: '|i⟩ Circular State', theta: Math.PI / 2, phi: Math.PI / 2 },
    { label: '|-i⟩ Circular State', theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>Module 01</span>
          <span>·</span>
          <span>Fundamental Quantum Mechanics</span>
          <span>·</span>
          <span>Dirac Bra-Ket Linear Algebra</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Core Quantum Physics: Superposition, Tunneling & Hilbert Space
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Explore the mathematical foundations of quantum states. Unlike classical bits constrained to 0 or 1, a qubit inhabits a 2-dimensional complex vector space C², parameterized continuously on the surface of the Bloch Sphere or propagating as a complex probability amplitude wavepacket.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'bloch', label: '1. Bloch Sphere Geometry', icon: Sliders },
            { id: 'tunneling', label: '2. Quantum Tunneling', icon: Sparkles },
            { id: 'schrodinger', label: '3. Schrödinger Equation', icon: Binary },
            { id: 'entanglement', label: '4. Non-Local Entanglement', icon: Binary },
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

      {/* Tab 1: Bloch Sphere Geometry */}
      {activeTab === 'bloch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <BlochSphere3D theta={theta} phi={phi} />

            <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                Canonical Quantum State Presets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetAngles.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setTheta(p.theta);
                      setPhi(p.phi);
                    }}
                    className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <span className="font-semibold block">{p.label}</span>
                    <span className="text-[10px] text-slate-400 block">
                      θ: {(p.theta / Math.PI).toFixed(2)}π · φ: {(p.phi / Math.PI).toFixed(2)}π
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Interactive State Angles</h3>

              {/* Theta Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">Polar Angle θ (Latitude)</span>
                  <span className="text-cyan-400 font-semibold">{((theta * 180) / Math.PI).toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.PI}
                  step="0.02"
                  value={theta}
                  onChange={(e) => setTheta(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>|0⟩ North Pole (0)</span>
                  <span>Equator (π/2)</span>
                  <span>|1⟩ South Pole (π)</span>
                </div>
              </div>

              {/* Phi Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">Azimuthal Angle φ (Longitude / Phase)</span>
                  <span className="text-violet-400 font-semibold">{((phi * 180) / Math.PI).toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={2 * Math.PI}
                  step="0.04"
                  value={phi}
                  onChange={(e) => setPhi(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>|+⟩ (0)</span>
                  <span>|i⟩ (π/2)</span>
                  <span>|-⟩ (π)</span>
                  <span>|-i⟩ (3π/2)</span>
                </div>
              </div>

              {/* Mathematical Edge Callout */}
              <div className="p-3.5 bg-[#0e1424] border border-slate-800 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-cyan-300 block font-mono">The Mathematical Edge</span>
                <p className="text-slate-300 leading-relaxed">
                  Every pure single-qubit state can be uniquely mapped to a unit vector r = (sin θ cos φ, sin θ sin φ, cos θ) where:
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-200">
                  |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
                </div>
                <p className="text-slate-400 text-[11px]">
                  Global phase e^(iγ) is unobservable in physical measurements; the relative phase φ dictates quantum interference and gate transformations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quantum Tunneling */}
      {activeTab === 'tunneling' && (
        <div className="space-y-4">
          <WaveTunnelingCanvas />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-cyan-300 block font-mono">Tunneling Phenomenon & Evanescent Waves</span>
              <p className="text-slate-300 leading-relaxed">
                In classical physics, a particle with energy E encountering a potential barrier V₀ &gt; E suffers 100% elastic rebound. In quantum mechanics, the wavefunction ψ(x) decays exponentially as exp(-κx) within the classically forbidden barrier:
              </p>
              <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-200">
                κ = √(2m(V₀ - E)) / ℏ
              </div>
              <p className="text-slate-400 text-[11px]">
                If barrier width a is finite, a non-zero probability amplitude leaks out, generating a transmitted wave on the other side.
              </p>
            </div>

            <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-violet-300 block font-mono">Real-World Quantum Applications</span>
              <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Josephson Junctions:</strong> Superconducting qubits (IBM, Google Sycamore) rely on Cooper pairs tunneling through an insulating oxide barrier.</li>
                <li><strong>Scanning Tunneling Microscopes (STM):</strong> Measures tip tunneling current to image atomic lattices with sub-angstrom resolution.</li>
                <li><strong>Flash Memory:</strong> Quantum tunneling charges floating-gate MOSFET transistors in NAND flash cells.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schrödinger Equation */}
      {activeTab === 'schrodinger' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white font-mono">Time-Dependent Schrödinger Equation</h3>
            <div className="p-3 bg-slate-950 rounded-lg font-mono text-cyan-300 text-xs text-center border border-slate-800">
              iℏ ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Hamiltonian operator Ĥ governs the total energy (kinetic + potential) of the system. For a time-independent Hamiltonian, unitary time evolution is generated via the operator matrix exponential:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg font-mono text-violet-300 text-xs text-center border border-slate-800">
              |Ψ(t)⟩ = exp(-iĤt / ℏ) |Ψ(0)⟩ = Û(t) |Ψ(0)⟩
            </div>
            <p className="text-xs text-slate-400">
              Because Û† Û = I, quantum evolution preserves statevector norm: ∑ |c_i|² = 1.0. Information is never lost until a non-unitary projective measurement occurs.
            </p>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white font-mono">Born&apos;s Statistical Rule & Wave Collapse</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When an observable Â = ∑ a_n |n⟩⟨n| is measured:
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Probability of outcome a_n:</span>
                <span className="text-cyan-300 font-semibold">P(a_n) = |⟨n|Ψ⟩|²</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Post-Measurement State:</span>
                <span className="text-amber-300 font-semibold">|Ψ&apos;⟩ = |n⟩</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Expectation Value ⟨A⟩:</span>
                <span className="text-emerald-300 font-semibold">⟨Ψ|Â|Ψ⟩</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Non-Local Entanglement */}
      {activeTab === 'entanglement' && (
        <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono">Maximally Entangled Bell & GHZ States</h3>
              <p className="text-xs text-slate-400">Einstein-Podolsky-Rosen (EPR) Paradox and Quantum Teleportation Resource</p>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'bell_phi_plus', label: '|Φ⁺⟩ = (|00⟩+|11⟩)/√2' },
                { id: 'bell_psi_plus', label: '|Ψ⁺⟩ = (|01⟩+|10⟩)/√2' },
                { id: 'ghz', label: '|GHZ⟩ = (|000⟩+|111⟩)/√2' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setEntanglementState(b.id as typeof entanglementState)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    entanglementState === b.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">State Equation</span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                {entanglementState === 'bell_phi_plus' && '(|00⟩ + |11⟩) / √2'}
                {entanglementState === 'bell_psi_plus' && '(|01⟩ + |10⟩) / √2'}
                {entanglementState === 'ghz' && '(|000⟩ + |111⟩) / √2'}
              </span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">CHSH Bell Inequality S</span>
              <span className="text-sm font-mono font-bold text-violet-300">
                S = 2√2 ≈ 2.828 &gt; 2.0 (Classical Limit)
              </span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Reduced State Purity</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                Tr(ρ_A²) = 0.500 (Maximally Mixed)
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2">
            An entangled composite state cannot be factored into individual tensor products |ψ_A⟩ ⊗ |ψ_B⟩. Measuring Qubit A instantaneously collapses the state of Qubit B across arbitrary spatial separation, enabling quantum teleportation, superdense coding, and device-independent quantum key distribution (QKD).
          </p>
        </div>
      )}
    </div>
  );
};
