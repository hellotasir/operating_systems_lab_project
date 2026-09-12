const INITIAL_PROCESSES = [
  { id: "P1", at: 0, bt: 5, priority: 2 },
  { id: "P2", at: 1, bt: 3, priority: 1 },
  { id: "P3", at: 2, bt: 8, priority: 3 },
  { id: "P4", at: 4, bt: 2, priority: 2 },
];

export const ALGORITHMS = [
  { id: "FCFS", name: "First Come First Serve" },
  { id: "SJF", name: "Shortest Job First" },
  { id: "PRIORITY", name: "Priority Scheduling" },
  { id: "RR", name: "Round Robin" },
  { id: "SRTF", name: "Shortest Remaining Time First" },
  { id: "LJF", name: "Longest Job First" },
];

export const QUANTUM_ALGORITHMS = ["RR"];

export const INITIAL_STATE = {
  processes: INITIAL_PROCESSES,
  algorithm: "FCFS",
  quantums: { RR: 2 },
  processOverrides: {},
  selectedAlgorithms: ["FCFS", "SJF", "RR"],
  stepIndex: 0,
};

export function getAlgorithmProcesses(state, algorithm) {
  return state.processOverrides[algorithm] ?? state.processes;
}

export const STEPS = [
  {
    id: "intro",
    eyebrow: "Operating Systems",
    title: "CPU Scheduling Visualizer",
  },
  {
    id: "identity",
    eyebrow: "Project",
    title: "Course & Group Details",
  },
  {
    id: "input",
    eyebrow: "Step 1 of 5",
    title: "Configure Processes",
    description:
      "Set an arrival time, burst time, and priority for each process.",
  },
  {
    id: "algorithm",
    eyebrow: "Step 2 of 5",
    title: "Choose An Algorithm",
    description:
      "Pick the algorithm to visualize, then choose which ones to compare later.",
  },
  {
    id: "results",
    eyebrow: "Step 3 of 5",
    title: "Review The Schedule",
    description:
      "The Gantt chart, averages, and per-process metrics for your chosen algorithm.",
  },
  {
    id: "compare-setup",
    eyebrow: "Step 4 of 5",
    title: "Configure Comparison Inputs",
    description:
      "Each selected algorithm starts from the processes in Step 1, but every value is editable here, including the time quantum for Round Robin.",
  },
  {
    id: "comparison",
    eyebrow: "Step 5 of 5",
    title: "Compare Algorithms",
    description:
      "See how your selected algorithms stack up against each other.",
  },
  {
    id: "end",
    eyebrow: "Complete",
    title: "The End",
  },
];

export function isValidProcessList(processes) {
  if (!Array.isArray(processes) || processes.length === 0) return false;

  const ids = new Set();

  for (const process of processes) {
    const id = String(process.id || "").trim();
    if (!id) return false;
    if (ids.has(id)) return false;
    ids.add(id);
    if (!(Number(process.bt) >= 1)) return false;
    if (!(Number(process.at) >= 0)) return false;
    if (!(Number(process.priority) >= 1)) return false;
  }

  return true;
}

export function canAdvanceFromStep(stepId, state) {
  switch (stepId) {
    case "input":
      return isValidProcessList(state.processes);
    case "algorithm":
      return state.selectedAlgorithms.length >= 2;
    case "compare-setup":
      return state.selectedAlgorithms.every((algorithm) => {
        if (!isValidProcessList(getAlgorithmProcesses(state, algorithm)))
          return false;
        if (!QUANTUM_ALGORITHMS.includes(algorithm)) return true;
        return Number(state.quantums[algorithm]) >= 1;
      });
    default:
      return true;
  }
}

export function schedulerReducer(state, action) {
  switch (action.type) {
    case "SET_PROCESSES":
      return { ...state, processes: action.payload };
    case "SET_ALGORITHM":
      return { ...state, algorithm: action.payload };
    case "SET_QUANTUM":
      return {
        ...state,
        quantums: {
          ...state.quantums,
          [action.payload.algorithm]: action.payload.quantum,
        },
      };
    case "SET_COMPARISON":
      return { ...state, selectedAlgorithms: action.payload };
    case "SET_PROCESS_OVERRIDE":
      return {
        ...state,
        processOverrides: {
          ...state.processOverrides,
          [action.payload.algorithm]: action.payload.processes,
        },
      };
    case "NEXT_STEP": {
      if (!canAdvanceFromStep(STEPS[state.stepIndex].id, state)) return state;
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1),
      };
    }
    case "PREV_STEP":
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

function normalizeProcesses(processes) {
  return processes
    .map((process, index) => ({
      id: String(process.id || `P${index + 1}`)
        .trim()
        .slice(0, 12),
      at: Math.max(0, Number(process.at) || 0),
      bt: Math.max(1, Number(process.bt) || 1),
      priority: Math.max(1, Number(process.priority) || 1),
    }))
    .filter((process) => process.id);
}

function addSegment(gantt, id, start, end) {
  if (end <= start) return;
  const last = gantt[gantt.length - 1];
  if (last && last.id === id && last.end === start) {
    last.end = end;
    return;
  }
  gantt.push({ id, start, end });
}

function calculateMetrics(processes, gantt) {
  const completion = new Map();
  gantt.forEach((segment) => {
    if (segment.id !== "IDLE") {
      completion.set(segment.id, segment.end);
    }
  });

  const rows = processes.map((process) => {
    const ct = completion.get(process.id) ?? 0;
    const tat = Math.max(0, ct - process.at);
    const wt = Math.max(0, tat - process.bt);
    return { ...process, ct, tat, wt };
  });

  const totalWaiting = rows.reduce((sum, row) => sum + row.wt, 0);
  const totalTurnaround = rows.reduce((sum, row) => sum + row.tat, 0);
  const totalIdle = gantt
    .filter((segment) => segment.id === "IDLE")
    .reduce((sum, segment) => sum + (segment.end - segment.start), 0);

  return {
    rows,
    averageWaiting: rows.length ? totalWaiting / rows.length : 0,
    averageTurnaround: rows.length ? totalTurnaround / rows.length : 0,
    idleTime: totalIdle,
  };
}

function fcfs(input) {
  const processes = [...input].sort(
    (a, b) => a.at - b.at || a.id.localeCompare(b.id),
  );
  const gantt = [];
  let time = 0;

  processes.forEach((process) => {
    if (time < process.at) {
      addSegment(gantt, "IDLE", time, process.at);
      time = process.at;
    }
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
  });

  return { gantt };
}

function sjf(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;

  while (completed.size < processes.length) {
    const available = processes
      .filter((process) => !completed.has(process.id) && process.at <= time)
      .sort((a, b) => a.bt - b.bt || a.at - b.at || a.id.localeCompare(b.id));

    if (!available.length) {
      const next = processes
        .filter((process) => !completed.has(process.id))
        .sort((a, b) => a.at - b.at)[0];

      addSegment(gantt, "IDLE", time, next.at);
      time = next.at;
      continue;
    }

    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }

  return { gantt };
}

function priorityScheduling(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;

  while (completed.size < processes.length) {
    const available = processes
      .filter((process) => !completed.has(process.id) && process.at <= time)
      .sort(
        (a, b) =>
          a.priority - b.priority || a.at - b.at || a.id.localeCompare(b.id),
      );

    if (!available.length) {
      const next = processes
        .filter((process) => !completed.has(process.id))
        .sort((a, b) => a.at - b.at)[0];

      addSegment(gantt, "IDLE", time, next.at);
      time = next.at;
      continue;
    }

    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }

  return { gantt };
}

function roundRobin(input, quantum) {
  const processes = [...input].sort(
    (a, b) => a.at - b.at || a.id.localeCompare(b.id),
  );
  const remaining = new Map(
    processes.map((process) => [process.id, process.bt]),
  );
  const gantt = [];
  const queue = [];
  let time = 0;
  let index = 0;
  let completed = 0;

  while (completed < processes.length) {
    while (index < processes.length && processes[index].at <= time) {
      queue.push(processes[index]);
      index += 1;
    }

    if (!queue.length && index < processes.length) {
      addSegment(gantt, "IDLE", time, processes[index].at);
      time = processes[index].at;
      continue;
    }

    const process = queue.shift();
    const left = remaining.get(process.id);
    const execution = Math.min(left, Math.max(1, quantum));

    addSegment(gantt, process.id, time, time + execution);
    time += execution;
    remaining.set(process.id, left - execution);

    while (index < processes.length && processes[index].at <= time) {
      queue.push(processes[index]);
      index += 1;
    }

    if (remaining.get(process.id) > 0) {
      queue.push(process);
    } else {
      completed += 1;
    }
  }

  return { gantt };
}

function srtf(input) {
  const processes = [...input];
  const remaining = new Map(
    processes.map((process) => [process.id, process.bt]),
  );
  const gantt = [];
  let time = 0;
  let completed = 0;

  while (completed < processes.length) {
    const available = processes
      .filter((process) => process.at <= time && remaining.get(process.id) > 0)
      .sort(
        (a, b) =>
          remaining.get(a.id) - remaining.get(b.id) ||
          a.at - b.at ||
          a.id.localeCompare(b.id),
      );

    if (!available.length) {
      const future = processes
        .filter((process) => remaining.get(process.id) > 0)
        .sort((a, b) => a.at - b.at)[0];

      addSegment(gantt, "IDLE", time, future.at);
      time = future.at;
      continue;
    }

    const process = available[0];
    addSegment(gantt, process.id, time, time + 1);
    remaining.set(process.id, remaining.get(process.id) - 1);
    time += 1;

    if (remaining.get(process.id) === 0) {
      completed += 1;
    }
  }

  return { gantt };
}

function ljf(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;

  while (completed.size < processes.length) {
    const available = processes
      .filter((process) => !completed.has(process.id) && process.at <= time)
      .sort((a, b) => b.bt - a.bt || a.at - b.at || a.id.localeCompare(b.id));

    if (!available.length) {
      const next = processes
        .filter((process) => !completed.has(process.id))
        .sort((a, b) => a.at - b.at)[0];

      addSegment(gantt, "IDLE", time, next.at);
      time = next.at;
      continue;
    }

    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }

  return { gantt };
}

export function runScheduler(algorithm, processes, quantum) {
  const normalized = normalizeProcesses(processes);
  let result;

  switch (algorithm) {
    case "FCFS":
      result = fcfs(normalized);
      break;
    case "SJF":
      result = sjf(normalized);
      break;
    case "PRIORITY":
      result = priorityScheduling(normalized);
      break;
    case "RR":
      result = roundRobin(normalized, quantum);
      break;
    case "SRTF":
      result = srtf(normalized);
      break;
    case "LJF":
      result = ljf(normalized);
      break;
    default:
      result = fcfs(normalized);
  }

  return {
    algorithm,
    gantt: result.gantt,
    ...calculateMetrics(normalized, result.gantt),
  };
}
