import React from 'react';
import { Complex } from '../../types/quantum';
import { C } from '../../lib/quantumEngine';
import { Zap, RefreshCw } from 'lucide-react';

interface ProbabilityHistogramProps {
  numQubits: number;
  statevector: Complex[];
  probabilities: number[];
  measuredState: number | null;
  onMeasure: () => void;
  onResetMeasurement: () => void;
}

export const ProbabilityHistogram: React.FC<ProbabilityHistogramProps> = ({
  numQubits,
  statevector,
  probabilities,
  measuredState,
  onMeasure,
  onResetMeasurement,
}) => {
  const totalStates = 1 << numQubits;

  // Format integer to binary state string e.g. 3 -> "|011⟩"
  const toKet = (index: number) => {
    const bin = index.toString(2).padStart(numQubits, '0');
    return `|${bin}⟩`;
  };

  return (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="px-4 py-3 bg-[#0e1424] border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-200">Statevector & Probability Distribution</span>
          <span className="text-[11px] text-slate-400 block font-mono">
            {totalStates} basis states ({numQubits} qubit{numQubits > 1 ? 's' : ''}) · Born Rule P(i) = |c_i|²
          </span>
        </div>

        <div className="flex items-center gap-2">
          {measuredState !== null ? (
            <button
              type="button"
              onClick={onResetMeasurement}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restore Superposition</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onMeasure}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Measure (Collapse)</span>
            </button>
          )}
        </div>
      </div>

      {/* Measurement Collapse Callout */}
      {measuredState !== null && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
          <span>Wavefunction Collapsed into state: <strong>{toKet(measuredState)}</strong></span>
          <span className="text-amber-400/80 text-[11px]">Observer Projection Verified</span>
        </div>
      )}

      {/* Probability Bars */}
      <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto">
        {Array.from({ length: totalStates }).map((_, idx) => {
          const prob = probabilities[idx] || 0;
          const amp = statevector[idx] || C.zero();
          const pct = (prob * 100).toFixed(1);
          const isCollapsed = measuredState === idx;
          const isZeroedOut = measuredState !== null && measuredState !== idx;

          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border transition-all ${
                isCollapsed
                  ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
                  : isZeroedOut
                  ? 'opacity-35 bg-slate-950/40 border-slate-900'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isCollapsed ? 'text-amber-300' : 'text-cyan-300'}`}>
                    {toKet(idx)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Amp: ({amp.re.toFixed(3)}{amp.im >= 0 ? '+' : ''}{amp.im.toFixed(3)}i)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">
                    Phase: {(C.phase(amp) / Math.PI).toFixed(2)}π
                  </span>
                  <span className={`font-semibold tabular-nums ${isCollapsed ? 'text-amber-300' : 'text-slate-200'}`}>
                    {isCollapsed ? '100%' : isZeroedOut ? '0.0%' : `${pct}%`}
                  </span>
                </div>
              </div>

              {/* Graphical fill bar */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCollapsed
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-cyan-500 to-violet-500'
                  }`}
                  style={{ width: `${isCollapsed ? 100 : isZeroedOut ? 0 : Math.max(prob * 100, 0.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
