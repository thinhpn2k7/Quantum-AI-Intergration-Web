import React, { useState } from 'react';
import { Brain, Layers, GitBranch, Cpu, Sparkles, TrendingDown } from 'lucide-react';

export const Module3QML: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'vqc' | 'qrl' | 'transformers'>('vqc');
  
  // VQC parameters
  const [layers, setLayers] = useState<number>(3);
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(10);
  const [currentLoss, setCurrentLoss] = useState<number>(0.042);

  // Tensor Network compression factor slider
  const [tensorRank, setTensorRank] = useState<number>(16);

  const simulateTraining = () => {
    setIsTraining(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setEpoch(step);
      // Loss decaying exponentially
      const newLoss = 0.85 * Math.exp(-step * 0.25 * (learningRate / 0.15)) + 0.015 * Math.random();
      setCurrentLoss(Number(newLoss.toFixed(4)));

      if (step >= 20) {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="p-6 bg-[#0b0f19] border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <span>Module 03</span>
          <span>·</span>
          <span>Quantum Machine Learning & Frontier AI</span>
          <span>·</span>
          <span>Xanadu PennyLane & PyTorch</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Quantum AI: Variational Circuits, Quantum RL & Tensor Networks
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Parameterize quantum states with trainable continuous rotation weights θ. Compute analytical gradients via the quantum Parameter-Shift rule, train Quantum Neural Networks (QNNs), empower reinforcement learning agents with superposition policies, and compress LLM weight matrices via Matrix Product State (MPS) tensor trains.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { id: 'vqc', label: '1. Variational Quantum Circuits (VQC & QNN)', icon: Brain },
            { id: 'qrl', label: '2. Quantum Reinforcement Learning (QRL)', icon: GitBranch },
            { id: 'transformers', label: '3. Quantum Transformers & Tensor Networks', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
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

      {/* Subtab 1: VQC and QNN */}
      {activeSubTab === 'vqc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Quantum Neural Network (QNN) Hyperparameters</h3>

              {/* Layers Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Ansatz Layer Depth (L)</span>
                  <span className="text-cyan-400 font-semibold">{layers} Layers ({layers * 4} Parameters)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={layers}
                  onChange={(e) => setLayers(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Learning Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Learning Rate (η)</span>
                  <span className="text-violet-400 font-semibold">{learningRate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
              </div>

              {/* Trigger Optimizer Button */}
              <button
                type="button"
                disabled={isTraining}
                onClick={simulateTraining}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 transition-colors flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <TrendingDown className="w-4 h-4" />
                <span>{isTraining ? `Training Epoch ${epoch}/20...` : 'Train Variational Ansatz (Parameter-Shift)'}</span>
              </button>

              {/* Real-time Loss Readout */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">MSE Loss Cost Function:</span>
                <span className="text-emerald-300 font-bold text-sm tabular-nums">
                  {currentLoss.toFixed(4)}
                </span>
              </div>

              {/* Parameter-Shift Rule Explanation */}
              <div className="p-3.5 bg-[#0e1424] border border-slate-800 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-cyan-300 block font-mono">The Parameter-Shift Rule</span>
                <p className="text-slate-300 leading-relaxed">
                  Quantum QPUs cannot perform classical backpropagation because inspecting intermediate states collapses the wavefunction. Instead, exact analytical gradients are evaluated by shifting the parameter by ±π/2:
                </p>
                <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-slate-200">
                  ∂⟨H⟩/∂θ = [ ⟨H⟩(θ + π/2) - ⟨H⟩(θ - π/2) ] / 2
                </div>
                <p className="text-slate-400 text-[11px]">
                  Requires exactly two circuit evaluations per parameter on physical hardware, preserving quantum coherence throughout.
                </p>
              </div>
            </div>
          </div>

          {/* Graphical VQC Architecture Diagram (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl">
              <h3 className="text-sm font-semibold text-white mb-3">
                Parameterized Quantum Circuit (Ansatz Topology)
              </h3>

              {/* Layer schematic */}
              <div className="p-4 bg-[#07090e] border border-slate-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>Input Encoding: U_Φ(x)</span>
                  <span>Variational Blocks (L={layers})</span>
                  <span>Expectation ⟨Z⟩</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {Array.from({ length: 4 }).map((_, q) => (
                    <div key={q} className="flex items-center gap-2">
                      <span className="w-12 text-cyan-400 font-bold">q[{q}]</span>
                      {/* Feature map block */}
                      <div className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]">
                        R_x(x_{q})
                      </div>

                      {/* Repeat ansatz layers */}
                      {Array.from({ length: layers }).map((_, l) => (
                        <React.Fragment key={l}>
                          <div className="px-2 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/70 text-cyan-300 text-[11px]">
                            R_y(θ_{q},{l})
                          </div>
                          {q < 3 && l === 0 && (
                            <div className="text-violet-400 font-bold">⊕</div>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Measurement output */}
                      <div className="ml-auto px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 text-[11px]">
                        ⟨Z_{q}⟩
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Decision Boundary Chart */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-2">
                    Non-Linear Classification Boundary (Hilbert Space Embedding)
                  </span>
                  <div className="h-36 w-full rounded bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {/* Simulated 2D decision contours */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-violet-950/40" />
                    <svg className="w-full h-full absolute inset-0">
                      <path
                        d="M 20 80 Q 150 10, 260 70 T 480 50"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      {/* Sample data points */}
                      <circle cx="80" cy="50" r="4" fill="#38bdf8" />
                      <circle cx="120" cy="40" r="4" fill="#38bdf8" />
                      <circle cx="160" cy="95" r="4" fill="#f43f5e" />
                      <circle cx="220" cy="110" r="4" fill="#f43f5e" />
                      <circle cx="310" cy="40" r="4" fill="#38bdf8" />
                      <circle cx="370" cy="90" r="4" fill="#f43f5e" />
                    </svg>
                    <div className="relative z-10 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded border border-slate-800">
                      Quantum Kernel Separability: Φ(x) = exp(i x_i Z_i)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Quantum Reinforcement Learning */}
      {activeSubTab === 'qrl' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Quantum Markov Decision Processes (Q-MDP)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In classical Reinforcement Learning, the agent selects an action a in A via an ε-greedy or softmax policy π(a|s). In Variational Quantum Q-Learning, the agent state is encoded directly as a quantum state |s⟩.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-cyan-300 space-y-1">
              <div>Q-Value: Q(s, a; θ) = ⟨s| U†(θ) O_a U(θ) |s⟩</div>
              <div className="text-slate-400 text-[11px]">Action Selection: a* = argmax_a Q(s, a; θ)</div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quantum superposition allows simultaneous evaluation of state-action branches, eliminating exponential exploratory sample complexity in high-dimensional environments.
            </p>
          </div>

          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-white">Variational Quantum Agent Architecture</h3>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-0.5">1. State Embedding:</span>
                Continuous sensor readings normalized to angles θ_s = arctan(x).
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-violet-400 font-bold block mb-0.5">2. Variational Policy Circuit:</span>
                Strongly entangling layers with trainable weights updated via temporal-difference error δ_t.
              </li>
              <li className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-0.5">3. Bellman Quantum Loss:</span>
                L(θ) = E[(r + γ max_a&apos; Q(s&apos;, a&apos;; θ⁻) - Q(s, a; θ))²].
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Subtab 3: Quantum Transformers & Tensor Networks */}
      {activeSubTab === 'transformers' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Quantum Transformers & Tensor-Train (MPS) LLM Weight Compression
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Modern Large Language Models (LLMs) suffer severe GPU VRAM memory bottlenecks. Quantum-inspired Tensor Networks (Matrix Product States - MPS) factorize massive weight matrices W in R^(d×d) into a low-rank chain of 3-way contracted tensors, achieving exponential parameter compression with minimal perplexity loss.
            </p>

            {/* Interactive Bond Dimension Rank Slider */}
            <div className="max-w-xl space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Tensor Bond Dimension (Rank χ)</span>
                <span className="text-cyan-400 font-semibold">χ = {tensorRank}</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={tensorRank}
                onChange={(e) => setTensorRank(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Live Compression Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono pt-2">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Uncompressed Matrix</span>
                <span className="text-sm font-semibold text-slate-200">4096 × 4096</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">67.11 MB (FP32)</span>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">MPS Tensor-Train Size</span>
                <span className="text-sm font-semibold text-cyan-300">
                  {((tensorRank * tensorRank * 16 * 4) / 1024).toFixed(1)} KB
                </span>
                <span className="text-[11px] text-cyan-400/80 block mt-0.5">
                  {(67.11 / (((tensorRank * tensorRank * 16 * 4) / (1024 * 1024)) || 1)).toFixed(0)}x Compression
                </span>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Weight Fidelity</span>
                <span className="text-sm font-semibold text-emerald-300">
                  {(99.8 - 50 / tensorRank).toFixed(2)} %
                </span>
                <span className="text-[11px] text-emerald-400/80 block mt-0.5">Truncated SVD Norm</span>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Attention Kernel</span>
                <span className="text-sm font-semibold text-violet-300">Quantum Swap Test</span>
                <span className="text-[11px] text-violet-400/80 block mt-0.5">⟨q_i | k_j⟩ in O(1) depth</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
