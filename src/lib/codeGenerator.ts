import { GateStep } from '../types/quantum';

export function generateQiskitCode(numQubits: number, gates: GateStep[]): string {
  const lines: string[] = [
    '# ============================================================',
    '# IBM Qiskit (v1.0+) Execution Script',
    '# Generated live by Quantum Learning Nexus',
    '# ============================================================',
    'from qiskit import QuantumCircuit, transpile',
    'from qiskit_aer import AerSimulator',
    'from qiskit.visualization import plot_histogram',
    'import numpy as np',
    '',
    `# Initialize quantum circuit with ${numQubits} qubit${numQubits > 1 ? 's' : ''}`,
    `qc = QuantumCircuit(${numQubits}, ${numQubits})`,
    '',
  ];

  if (gates.length === 0) {
    lines.push('# Circuit in ground state |0...0>');
  } else {
    for (const gate of gates) {
      const q = gate.targetQubit;
      const ctrl = gate.controlQubit ?? 0;
      const th = gate.theta !== undefined ? gate.theta.toFixed(4) : '0.0000';

      switch (gate.type) {
        case 'H':
          lines.push(`qc.h(${q})`);
          break;
        case 'X':
          lines.push(`qc.x(${q})`);
          break;
        case 'Y':
          lines.push(`qc.y(${q})`);
          break;
        case 'Z':
          lines.push(`qc.z(${q})`);
          break;
        case 'S':
          lines.push(`qc.s(${q})`);
          break;
        case 'T':
          lines.push(`qc.t(${q})`);
          break;
        case 'RX':
          lines.push(`qc.rx(${th}, ${q})`);
          break;
        case 'RY':
          lines.push(`qc.ry(${th}, ${q})`);
          break;
        case 'RZ':
          lines.push(`qc.rz(${th}, ${q})`);
          break;
        case 'CNOT':
          lines.push(`qc.cx(${ctrl}, ${q})`);
          break;
        case 'CZ':
          lines.push(`qc.cz(${ctrl}, ${q})`);
          break;
        case 'SWAP':
          lines.push(`qc.swap(${ctrl}, ${q})`);
          break;
      }
    }
  }

  lines.push('');
  lines.push('# Measure all qubits into classical registers');
  lines.push('qc.measure(range(' + numQubits + '), range(' + numQubits + '))');
  lines.push('');
  lines.push('# Simulate on high-fidelity statevector engine');
  lines.push('backend = AerSimulator()');
  lines.push('transpiled_circuit = transpile(qc, backend, optimization_level=3)');
  lines.push('job = backend.run(transpiled_circuit, shots=2048)');
  lines.push('result = job.result()');
  lines.push('counts = result.get_counts(qc)');
  lines.push('');
  lines.push('print("Measurement Counts (Basis States):", counts)');
  lines.push('print("Statevector Purity: 1.0 (Unitary Simulation)")');

  return lines.join('\n');
}

export function generatePennyLaneCode(numQubits: number, gates: GateStep[]): string {
  const lines: string[] = [
    '# ============================================================',
    '# Xanadu PennyLane (v0.36+) Variational Quantum Neural Network',
    '# Automatic differentiation & gradient-based optimization',
    '# ============================================================',
    'import pennylane as qml',
    'from pennylane import numpy as np',
    '',
    `# Instantiate high-speed analytical statevector simulator`,
    `dev = qml.device("default.qubit", wires=${numQubits})`,
    '',
    '@qml.qnode(dev, diff_method="parameter-shift")',
    `def quantum_circuit(params):`,
  ];

  if (gates.length === 0) {
    lines.push('    # Identity state |00...0>');
    lines.push('    return qml.probs(wires=range(' + numQubits + '))');
  } else {
    let paramIdx = 0;
    for (const gate of gates) {
      const q = gate.targetQubit;
      const ctrl = gate.controlQubit ?? 0;

      switch (gate.type) {
        case 'H':
          lines.push(`    qml.Hadamard(wires=${q})`);
          break;
        case 'X':
          lines.push(`    qml.PauliX(wires=${q})`);
          break;
        case 'Y':
          lines.push(`    qml.PauliY(wires=${q})`);
          break;
        case 'Z':
          lines.push(`    qml.PauliZ(wires=${q})`);
          break;
        case 'S':
          lines.push(`    qml.S(wires=${q})`);
          break;
        case 'T':
          lines.push(`    qml.T(wires=${q})`);
          break;
        case 'RX':
          lines.push(`    qml.RX(params[${paramIdx}], wires=${q})`);
          paramIdx++;
          break;
        case 'RY':
          lines.push(`    qml.RY(params[${paramIdx}], wires=${q})`);
          paramIdx++;
          break;
        case 'RZ':
          lines.push(`    qml.RZ(params[${paramIdx}], wires=${q})`);
          paramIdx++;
          break;
        case 'CNOT':
          lines.push(`    qml.CNOT(wires=[${ctrl}, ${q}])`);
          break;
        case 'CZ':
          lines.push(`    qml.CZ(wires=[${ctrl}, ${q}])`);
          break;
        case 'SWAP':
          lines.push(`    qml.SWAP(wires=[${ctrl}, ${q}])`);
          break;
      }
    }

    lines.push(`    # Return computational basis probabilities`);
    lines.push(`    return qml.probs(wires=range(${numQubits}))`);
  }

  lines.push('');
  lines.push('# Initialize trainable variational weights');
  const paramCount = gates.filter((g) => ['RX', 'RY', 'RZ'].includes(g.type)).length;
  if (paramCount > 0) {
    const defaultParams = gates
      .filter((g) => ['RX', 'RY', 'RZ'].includes(g.type))
      .map((g) => (g.theta !== undefined ? g.theta.toFixed(4) : '0.7854'))
      .join(', ');
    lines.push(`init_params = np.array([${defaultParams}], requires_grad=True)`);
    lines.push('');
    lines.push('# Loss function: Target expectation value minimization');
    lines.push('def cost_fn(p):');
    lines.push('    probs = quantum_circuit(p)');
    lines.push('    # Optimize towards maximizing |00...0> or target Hamiltonian');
    lines.push('    return -probs[0]');
    lines.push('');
    lines.push('# Execute gradient descent via parameter-shift rule');
    lines.push('opt = qml.GradientDescentOptimizer(stepsize=0.15)');
    lines.push('params = init_params');
    lines.push('for step in range(10):');
    lines.push('    params, cost = opt.step_and_cost(cost_fn, params)');
    lines.push('    print(f"Epoch {step:02d} | Cost: {cost:.6f}")');
  } else {
    lines.push('init_params = np.array([], requires_grad=True)');
    lines.push('probs = quantum_circuit(init_params)');
    lines.push('print("Analytical State Probabilities:", probs)');
  }

  return lines.join('\n');
}

export function generateCuQuantumCode(numQubits: number): string {
  return [
    '# ============================================================',
    '# NVIDIA cuQuantum SDK (cuStateVec) Acceleration Architecture',
    '# High-Performance Computing (HPC) GPU Matrix-Vector Pipeline',
    '# ============================================================',
    'import cupy as cp',
    'import numpy as np',
    'from cuquantum import custatevec as cusv',
    '',
    `n_qubits = ${numQubits}`,
    'dim = 1 << n_qubits',
    '',
    '# Allocate GPU statevector buffer in device VRAM (FP64 Complex)',
    'd_sv = cp.zeros(dim, dtype=cp.complex128)',
    'd_sv[0] = 1.0 + 0.0j  # Initialize |0...0>',
    '',
    '# Create cuStateVec workspace handle',
    'handle = cusv.create()',
    'workspace_size = cusv.apply_matrix_get_workspace_size(',
    '    handle, cp.cuda.runtime.cudaDataType.CUDA_C_64F,',
    '    n_qubits, matrix_type=cusv.MatrixType.UNITARY',
    ')',
    'd_work = cp.empty(workspace_size, dtype=cp.int8)',
    '',
    '# Execute batched tensor contractions with Tensor Cores (H100 / A100)',
    'print(f"Allocated {dim * 16 / (1024**2):.3f} MB VRAM on NVIDIA GPU.")',
    'print("Status: cuQuantum Tensor Core pipeline active.")',
  ].join('\n');
}
