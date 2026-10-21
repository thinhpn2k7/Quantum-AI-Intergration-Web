import React, { useState } from 'react';
import { GateStep } from '../types/quantum';
import { generateQiskitCode, generatePennyLaneCode, generateCuQuantumCode } from '../lib/codeGenerator';
import { Copy, Check, Download, Terminal, X } from 'lucide-react';

interface CodeSynchronizerProps {
  numQubits: number;
  gates: GateStep[];
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const CodeSynchronizer: React.FC<CodeSynchronizerProps> = ({
  numQubits,
  gates,
  isOpen = true,
  onClose,
  isModal = false,
}) => {
  const [activeLang, setActiveLang] = useState<'qiskit' | 'pennylane' | 'cuquantum'>('qiskit');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const qiskitCode = generateQiskitCode(numQubits, gates);
  const pennylaneCode = generatePennyLaneCode(numQubits, gates);
  const cuQuantumCode = generateCuQuantumCode(numQubits);

  const currentCode =
    activeLang === 'qiskit'
      ? qiskitCode
      : activeLang === 'pennylane'
      ? pennylaneCode
      : cuQuantumCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `quantum_${activeLang}_circuit.py`;
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Code Header Bar */}
      <div className="px-4 py-3 bg-[#0e1424] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <div className="flex gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveLang('qiskit')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                activeLang === 'qiskit'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IBM Qiskit
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('pennylane')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                activeLang === 'pennylane'
                  ? 'bg-violet-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Xanadu PennyLane
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('cuquantum')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                activeLang === 'cuquantum'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NVIDIA cuQuantum
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Script</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Text Body */}
      <div className="p-4 bg-[#07090e] overflow-x-auto max-h-[460px] font-mono text-xs leading-relaxed text-slate-200">
        <pre className="selection:bg-cyan-500/30">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Bottom Footer Note */}
      <div className="px-4 py-2 bg-[#0e1424] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Synchronized dynamically with current visual circuit state</span>
        <span className="text-cyan-400">Python 3.10+ Tested</span>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-3xl">{content}</div>
      </div>
    );
  }

  return content;
};
