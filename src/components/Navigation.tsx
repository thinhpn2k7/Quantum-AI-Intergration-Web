import React from 'react';
import { ModuleId } from '../types/quantum';
import { Terminal, Atom } from 'lucide-react';

interface NavigationProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  onOpenCodeModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  onOpenCodeModal,
}) => {
  const modules: { id: ModuleId; label: string }[] = [
    { id: 'physics', label: 'Core Physics' },
    { id: 'circuits', label: 'Quantum Gates' },
    { id: 'qml', label: 'Quantum AI & QML' },
    { id: 'optimization', label: 'Optimization' },
    { id: 'hpc', label: 'HPC & Hybrid' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <Atom className="w-5 h-5 text-cyan-400 stroke-[2.2]" />
          <span className="text-base font-bold tracking-tight text-white">
            Quantum Learning Nexus
          </span>
        </div>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectModule(m.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCodeModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-400/20"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Sync Python Code</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Strip */}
      <div className="flex lg:hidden overflow-x-auto px-6 py-2 gap-4 border-t border-slate-800/80 bg-[#0a0d16]">
        {modules.map((m) => {
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModule(m.id)}
              className={`text-xs whitespace-nowrap py-1 border-b-2 transition-colors ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
