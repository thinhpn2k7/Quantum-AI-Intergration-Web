export interface Complex {
  re: number;
  im: number;
}

export type GateType = 
  | 'H' 
  | 'X' 
  | 'Y' 
  | 'Z' 
  | 'S' 
  | 'T' 
  | 'RX' 
  | 'RY' 
  | 'RZ' 
  | 'CNOT' 
  | 'CZ' 
  | 'SWAP';

export interface GateStep {
  id: string;
  type: GateType;
  targetQubit: number;
  controlQubit?: number;
  theta?: number; // radians for parameterized rotation
}

export interface QubitState {
  index: number;
  theta: number; // polar angle [0, pi]
  phi: number;   // azimuthal angle [0, 2*pi]
  blochVector: { x: number; y: number; z: number };
  probabilities: { zero: number; one: number };
}

export interface CircuitState {
  numQubits: number;
  gates: GateStep[];
  statevector: Complex[];
  probabilities: number[];
  measuredState: number | null;
}

export type ModuleId = 
  | 'physics' 
  | 'circuits' 
  | 'qml' 
  | 'optimization' 
  | 'hpc';

export interface ModuleInfo {
  id: ModuleId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface BenchmarkDataPoint {
  qubits: number;
  stateSize: string;
  classicalRamMB: number;
  quantumRamKB: number;
  classicalSimTimeMs: number;
  cuQuantumGpuTimeMs: number;
  qpuNativeTimeUs: number;
}
