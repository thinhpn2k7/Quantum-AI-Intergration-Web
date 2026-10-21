import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { computeTunneling } from '../../lib/quantumEngine';

export const WaveTunnelingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [energyE, setEnergyE] = useState<number>(2.4);
  const [barrierV0, setBarrierV0] = useState<number>(3.6);
  const [barrierWidthA, setBarrierWidthA] = useState<number>(1.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);

  // Animation frame loop for wave propagation
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    const loop = () => {
      setTime((prev) => (prev + 0.05) % 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Compute exact transmission and reflection
  const tunnelingData = computeTunneling(energyE, barrierV0, barrierWidthA);
  const T = tunnelingData.transmissionT;
  const R = tunnelingData.reflectionR;

  // Render on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const centerY = height * 0.65;
    const scaleX = width / 10; // -5 to +5 x range
    const toCanvasX = (x: number) => (x + 5) * scaleX;

    const barrierStart = -barrierWidthA / 2;
    const barrierEnd = barrierWidthA / 2;
    const barrierCanvasX1 = toCanvasX(barrierStart);
    const barrierCanvasX2 = toCanvasX(barrierEnd);
    const barrierHeightPx = (barrierV0 / 5) * (height * 0.45);

    // 1. Draw Potential Barrier V(x) Box
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(barrierCanvasX1, centerY - barrierHeightPx, barrierCanvasX2 - barrierCanvasX1, barrierHeightPx);
    ctx.strokeRect(barrierCanvasX1, centerY - barrierHeightPx, barrierCanvasX2 - barrierCanvasX1, barrierHeightPx);

    // Barrier label
    ctx.font = '600 11px "JetBrains Mono"';
    ctx.fillStyle = '#f87171';
    ctx.fillText(`V₀ = ${barrierV0.toFixed(1)} eV`, barrierCanvasX1 + 6, centerY - barrierHeightPx - 6);

    // 2. Draw Incident Energy Level E line
    const energyHeightPx = (energyE / 5) * (height * 0.45);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, centerY - energyHeightPx);
    ctx.lineTo(width, centerY - energyHeightPx);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#22d3ee';
    ctx.fillText(`Energy E = ${energyE.toFixed(1)} eV`, 12, centerY - energyHeightPx - 6);

    // 3. Draw Ground Line (V=0)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 4. Draw Oscillating Wavefunction Real Part Re(ψ(x, t))
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;

    const k1 = Math.sqrt(Math.max(0.1, energyE)) * 4;
    const omega = energyE * 2.5;
    const phase = time * omega * 0.1;

    for (let px = 0; px <= width; px += 2) {
      const x = (px / scaleX) - 5;
      let psi = 0;

      if (x < barrierStart) {
        // Incident wave travelling right + reflected wave travelling left
        const inc = Math.cos(k1 * x - phase);
        const ref = Math.sqrt(R) * Math.cos(-k1 * x - phase + Math.PI / 3);
        psi = (inc + ref) * 0.5;
      } else if (x <= barrierEnd) {
        // Evanescent decay
        const k2 = Math.sqrt(Math.max(0.05, Math.abs(barrierV0 - energyE))) * 3.5;
        const decay = Math.exp(-k2 * (x - barrierStart));
        psi = decay * Math.cos(-phase) * 0.5;
      } else {
        // Transmitted wave travelling right
        const trans = Math.sqrt(T) * Math.cos(k1 * (x - barrierEnd) - phase);
        psi = trans * 0.5;
      }

      const py = (centerY - energyHeightPx) - psi * 35;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 5. Draw Probability Density Fill Envelope |ψ(x)|²
    ctx.beginPath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.moveTo(0, centerY);

    tunnelingData.wavepacketPoints.forEach((pt, i) => {
      const cx = toCanvasX(pt.x);
      const density = pt.incident + pt.barrier + pt.transmitted;
      const cy = centerY - density * 70;
      if (i === 0) ctx.lineTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });

    ctx.lineTo(width, centerY);
    ctx.closePath();
    ctx.fill();
  }, [energyE, barrierV0, barrierWidthA, time, tunnelingData, R, T]);

  return (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Simulation Stage Header */}
      <div className="px-4 py-3 bg-[#0e1424] border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-200">Quantum Tunneling Wavepacket Simulation</span>
          <span className="text-[11px] text-slate-400 block font-mono">Schrödinger equation across square barrier V(x)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEnergyE(2.4);
              setBarrierV0(3.6);
              setBarrierWidthA(1.8);
              setTime(0);
            }}
            className="p-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-64 bg-[#07090e]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Control Sliders & Quantum Metrics Deck */}
      <div className="p-4 bg-[#0e1424] border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Particle Energy (E)</span>
              <span className="text-cyan-400 font-semibold">{energyE.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={energyE}
              onChange={(e) => setEnergyE(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Barrier Height (V₀)</span>
              <span className="text-rose-400 font-semibold">{barrierV0.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={barrierV0}
              onChange={(e) => setBarrierV0(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Barrier Width (a)</span>
              <span className="text-violet-400 font-semibold">{barrierWidthA.toFixed(2)} nm</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.5"
              step="0.1"
              value={barrierWidthA}
              onChange={(e) => setBarrierWidthA(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
          </div>
        </div>

        {/* Telemetry Output Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono pt-3 border-t border-slate-800/80">
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Transmission (T)</span>
            <span className="text-sm font-semibold text-cyan-300 tabular-nums">
              {(T * 100).toFixed(2)} %
            </span>
          </div>

          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Reflection (R)</span>
            <span className="text-sm font-semibold text-rose-300 tabular-nums">
              {(R * 100).toFixed(2)} %
            </span>
          </div>

          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Regime</span>
            <span className={`text-xs font-semibold block ${energyE < barrierV0 ? 'text-amber-300' : 'text-emerald-300'}`}>
              {energyE < barrierV0 ? 'Classical Forbidden (Tunneling)' : 'Resonant Transmission'}
            </span>
          </div>

          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Conservation</span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums block">
              T + R = {(T + R).toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
