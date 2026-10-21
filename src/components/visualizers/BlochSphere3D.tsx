import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Compass, Eye } from 'lucide-react';

interface BlochSphere3DProps {
  theta: number; // [0, pi]
  phi: number;   // [0, 2*pi]
  qubitIndex?: number;
}

export const BlochSphere3D: React.FC<BlochSphere3DProps> = ({ theta, phi, qubitIndex = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState<number>(0.75); // horizontal rotation
  const [pitch, setPitch] = useState<number>(0.35); // vertical tilt
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Cartesian coordinates of state on unit sphere (radius = 1)
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + 0.01) % (2 * Math.PI));
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Canvas 3D rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.36;

    ctx.clearRect(0, 0, width, height);

    // 3D rotation projection helper
    // 3D space: X right, Y in/out, Z up
    const project = (px: number, py: number, pz: number): { x: number; y: number; depth: number } => {
      // Rotate around Z axis by yaw
      const x1 = px * Math.cos(yaw) - py * Math.sin(yaw);
      const y1 = px * Math.sin(yaw) + py * Math.cos(yaw);
      const z1 = pz;

      // Rotate around X axis by pitch
      const x2 = x1;
      const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
      const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);

      // Orthographic projection to 2D
      return {
        x: cx + x2 * R,
        y: cy - z2 * R, // invert Z for screen Y
        depth: y2,
      };
    };

    // Draw background subtle radial glow
    const radial = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.3);
    radial.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
    radial.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
    radial.addColorStop(1, 'rgba(7, 9, 14, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.25, 0, 2 * Math.PI);
    ctx.fill();

    // 1. Draw Sphere Outer Wireframe Outline
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.stroke();

    // 2. Draw Latitude Lines (Equator and parallels)
    const latitudes = [-Math.PI / 4, 0, Math.PI / 4];
    latitudes.forEach((lat) => {
      ctx.beginPath();
      ctx.strokeStyle = lat === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = lat === 0 ? 1.5 : 1;
      const segments = 64;
      const r_lat = Math.cos(lat);
      const z_lat = Math.sin(lat);

      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * 2 * Math.PI;
        const px = r_lat * Math.cos(angle);
        const py = r_lat * Math.sin(angle);
        const pt = project(px, py, z_lat);
        if (s === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });

    // 3. Draw Longitude Meridian Circles
    const meridians = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
    meridians.forEach((lon) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 1;
      const segments = 64;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * 2 * Math.PI;
        const px = Math.cos(angle) * Math.cos(lon);
        const py = Math.cos(angle) * Math.sin(lon);
        const pz = Math.sin(angle);
        const pt = project(px, py, pz);
        if (s === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });

    // 4. Draw 3D Coordinate Axes (+X, -X, +Y, -Y, +Z, -Z)
    const axes = [
      { name: '+X |+⟩', dir: [1.2, 0, 0], color: 'rgba(148, 163, 184, 0.8)' },
      { name: '-X |-⟩', dir: [-1.2, 0, 0], color: 'rgba(71, 85, 105, 0.5)' },
      { name: '+Y |i⟩', dir: [0, 1.2, 0], color: 'rgba(148, 163, 184, 0.8)' },
      { name: '-Y |-i⟩', dir: [0, -1.2, 0], color: 'rgba(71, 85, 105, 0.5)' },
      { name: '|0⟩ (+Z)', dir: [0, 0, 1.28], color: 'rgba(34, 211, 238, 0.95)', bold: true },
      { name: '|1⟩ (-Z)', dir: [0, 0, -1.28], color: 'rgba(139, 92, 246, 0.95)', bold: true },
    ];

    axes.forEach((axis) => {
      const start = project(0, 0, 0);
      const end = project(axis.dir[0], axis.dir[1], axis.dir[2]);

      ctx.beginPath();
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = axis.bold ? 1.8 : 1;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Axis label
      ctx.font = axis.bold ? '600 12px "JetBrains Mono"' : '400 10px "JetBrains Mono"';
      ctx.fillStyle = axis.color;
      ctx.fillText(axis.name, end.x + 4, end.y + 4);
    });

    // 5. Draw Projection Shadow on Equator Plane (Z=0)
    const stateProj = project(x, y, 0);
    const origin = project(0, 0, 0);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(stateProj.x, stateProj.y);
    ctx.stroke();

    // Vertical projection line from state vector to XY plane
    const statePoint = project(x, y, z);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.moveTo(statePoint.x, statePoint.y);
    ctx.lineTo(stateProj.x, stateProj.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // 6. Draw State Vector Needle
    // Glow effect
    ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(statePoint.x, statePoint.y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Terminus glowing head
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(statePoint.x, statePoint.y, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(statePoint.x, statePoint.y, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // 7. Vector State Label
    ctx.font = '600 13px "JetBrains Mono"';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`|ψ⟩_q${qubitIndex}`, statePoint.x + 10, statePoint.y - 10);
  }, [theta, phi, yaw, pitch, qubitIndex, autoRotate]);

  // Mouse drag handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setYaw((prev) => prev + dx * 0.01);
    setPitch((prev) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev + dy * 0.01)));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setYaw(0.75);
    setPitch(0.35);
  };

  const thetaDeg = ((theta * 180) / Math.PI).toFixed(1);
  const phiDeg = ((phi * 180) / Math.PI).toFixed(1);

  // Theoretical probability amplitudes
  const amp0 = Math.cos(theta / 2);
  const amp1 = Math.sin(theta / 2);
  const prob0 = (amp0 * amp0 * 100).toFixed(1);
  const prob1 = (amp1 * amp1 * 100).toFixed(1);

  return (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* 3D Visual Canvas Stage */}
      <div
        className="relative w-full h-80 bg-gradient-to-b from-[#07090e] to-[#0c1220] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Viewport Control Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg text-xs font-mono border transition-colors ${
              autoRotate
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Auto-rotate view"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-lg text-xs font-mono bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset 3D camera"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag Hint overlay */}
        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>Click & drag to orbit 3D sphere</span>
        </div>
      </div>

      {/* Numerical Coordinate & Bra-Ket Telemetry Panel */}
      <div className="p-4 bg-[#0e1424] border-t border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Polar Angle θ</span>
            <span className="text-sm font-semibold text-cyan-300 tabular-nums">
              {thetaDeg}° <span className="text-slate-400 font-normal">({(theta / Math.PI).toFixed(2)}π)</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Azimuthal Angle φ</span>
            <span className="text-sm font-semibold text-violet-300 tabular-nums">
              {phiDeg}° <span className="text-slate-400 font-normal">({(phi / Math.PI).toFixed(2)}π)</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Bloch Vector (x,y,z)</span>
            <span className="text-xs font-medium text-slate-200 tabular-nums truncate block">
              [{x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)}]
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Probabilities</span>
            <span className="text-xs font-semibold text-emerald-300 tabular-nums block">
              |0⟩: {prob0}% · |1⟩: {prob1}%
            </span>
          </div>
        </div>

        {/* State Equation expansion */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="truncate">
            <span className="text-slate-400">Expansion: </span>
            <span className="text-cyan-400 font-medium">{amp0.toFixed(3)}</span>|0⟩ +{' '}
            <span className="text-violet-400 font-medium">({amp1.toFixed(3)} e^{`{i${(phi / Math.PI).toFixed(2)}π}`})</span>|1⟩
          </div>
          <span className="text-slate-400 text-[11px] shrink-0 ml-2">Purity: 1.000</span>
        </div>
      </div>
    </div>
  );
};
