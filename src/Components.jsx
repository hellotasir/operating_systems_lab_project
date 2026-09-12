import { memo, useCallback, useId, useMemo } from "react";
import { motion } from "motion/react";
import { ALGORITHMS, QUANTUM_ALGORITHMS } from "./scheduler";
import { useScheduler } from "./useScheduler";

const algorithmNames = Object.fromEntries(
  ALGORITHMS.map((algorithm) => [algorithm.id, algorithm.name]),
);

const segmentClasses = [
  "bg-orange-400",
  "bg-orange-500",
  "bg-orange-600",
  "bg-neutral-800",
  "bg-neutral-600",
  "bg-orange-300",
];

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-black outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const noScrollbar =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function NavIcon({ direction }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}

export const StepFrame = memo(function StepFrame({
  eyebrow,
  title,
  description,
  children,
}) {
  const { goNext, goBack, canGoNext, canGoBack, isLastStep } = useScheduler();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div
        className={`flex-1 overflow-y-auto px-6 pt-8 sm:px-16 sm:pt-16 ${noScrollbar}`}
      >
        <div className="mx-auto w-screen max-w-[90%]">
          {eyebrow && (
            <p className="text-xs font-black uppercase tracking-widest text-orange-600">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-neutral-500 sm:text-base">
              {description}
            </p>
          )}

          <div className="mt-8 pb-4">{children}</div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 sm:px-16 sm:pb-12">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Previous step"
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-black transition hover:bg-neutral-300 ${
            canGoBack ? "" : "invisible"
          }`}
        >
          <NavIcon direction="left" />
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next step"
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
            isLastStep
              ? "invisible"
              : canGoNext
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "cursor-not-allowed bg-neutral-200 text-neutral-400"
          }`}
        >
          <NavIcon direction="right" />
        </button>
      </div>
    </div>
  );
});

export const IntroSlide = memo(function IntroSlide() {
  return (
    <div className="space-y-4 text-sm font-medium leading-6 text-neutral-600 sm:text-base">
      <p className="text-lg">
        Four processes arrive with their own arrival time, burst time, and
        priority. Step through First Come First Serve, Shortest Job First,
        Priority Scheduling, Round Robin, Shortest Remaining Time First, and
        Longest Job First to see how each one orders the CPU.
      </p>
      <p>Use the arrow in the corner to begin.</p>
    </div>
  );
});

export const IdentitySlide = memo(function IdentitySlide() {
  return (
   <div className="space-y-8 text-neutral-600">
  <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
      Course details
    </h3>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Course title: Operating Systems Lab
    </p>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Course code: CSE362
    </p>
    <p className="text-lg font-medium leading-7 sm:text-xl">Section: 04</p>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Project Title: Designing algorithm visualizer for CPU scheduling
      algorithms
    </p>
  </div>

  <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
      Group members
    </h3>
    <div className="space-y-3">
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Tasir Rahman, ID: 2023100000371, Batch: 64
      </p>
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Azizul Hakim Omor, ID: 2023100000012, Batch: 64
      </p>
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Saiful Islam Riad, ID: 2023000000022, Batch: 63
      </p>
    </div>
  </div>
</div>
  );
});

export const EndSlide = memo(function EndSlide() {
  const { reset } = useScheduler();

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium leading-6 text-neutral-600 sm:text-base">
        You have walked through process configuration, algorithm selection, the
        resulting schedule, and a side-by-side comparison. Restart to try a
        different set of processes.
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
      >
        Run Again
      </button>
    </div>
  );
});

export const ProcessInput = memo(function ProcessInput() {
  const { state, updateProcesses } = useScheduler();
  const formId = useId();

  const updateRow = useCallback(
    (index, field, value) => {
      const next = state.processes.map((process, processIndex) =>
        processIndex === index
          ? {
              ...process,
              [field]:
                field === "id"
                  ? value.replace(/[^\w-]/g, "").slice(0, 12)
                  : Math.max(field === "bt" ? 1 : 0, Number(value) || 0),
            }
          : process,
      );

      updateProcesses(next);
    },
    [state.processes, updateProcesses],
  );

  const addProcess = useCallback(() => {
    const nextNumber = state.processes.length + 1;

    updateProcesses([
      ...state.processes,
      { id: `P${nextNumber}`, at: 0, bt: 1, priority: 1 },
    ]);
  }, [state.processes, updateProcesses]);

  const removeProcess = useCallback(
    (index) => {
      if (state.processes.length <= 1) return;

      updateProcesses(
        state.processes.filter((_, processIndex) => processIndex !== index),
      );
    },
    [state.processes, updateProcesses],
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={addProcess}
          className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-orange-600"
        >
          + Add Process
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-200 text-left text-xs font-black uppercase tracking-wider text-black">
              <th className="px-4 py-3">Process ID</th>
              <th className="px-4 py-3">Arrival Time</th>
              <th className="px-4 py-3">Burst Time</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {state.processes.map((process, index) => (
              <motion.tr
                layout
                key={`${formId}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-neutral-200"
              >
                <td className="px-4 py-3">
                  <input
                    className={inputClass}
                    value={process.id}
                    onChange={(event) =>
                      updateRow(index, "id", event.target.value)
                    }
                    maxLength={12}
                    aria-label={`Process ${index + 1} ID`}
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={process.at}
                    onChange={(event) =>
                      updateRow(index, "at", event.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={process.bt}
                    onChange={(event) =>
                      updateRow(index, "bt", event.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={process.priority}
                    onChange={(event) =>
                      updateRow(index, "priority", event.target.value)
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => removeProcess(index)}
                    className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={state.processes.length <= 1}
                  >
                    Remove
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export const AlgorithmSelector = memo(function AlgorithmSelector() {
  const { state, updateAlgorithm, updateQuantum, updateComparison } =
    useScheduler();

  const toggleComparison = useCallback(
    (algorithm) => {
      const exists = state.selectedAlgorithms.includes(algorithm);

      if (exists) {
        if (state.selectedAlgorithms.length <= 2) return;

        updateComparison(
          state.selectedAlgorithms.filter((item) => item !== algorithm),
        );
        return;
      }

      updateComparison([...state.selectedAlgorithms, algorithm]);
    },
    [state.selectedAlgorithms, updateComparison],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl bg-orange-500 p-5 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-orange-100">
          Visualization
        </p>

        <h2 className="mt-1 text-xl font-black">Scheduling Algorithm</h2>

        <select
          value={state.algorithm}
          onChange={(event) => updateAlgorithm(event.target.value)}
          className="mt-5 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-black text-black outline-none"
        >
          {ALGORITHMS.map((algorithm) => (
            <option key={algorithm.id} value={algorithm.id}>
              {algorithm.name}
            </option>
          ))}
        </select>

        {QUANTUM_ALGORITHMS.includes(state.algorithm) && (
          <div className="mt-4">
            <label className="mb-2 block text-xs font-black uppercase tracking-wider">
              Time Quantum
            </label>

            <input
              type="number"
              min="1"
              value={state.quantums[state.algorithm] ?? 2}
              onChange={(event) =>
                updateQuantum(
                  state.algorithm,
                  Math.max(1, Number(event.target.value) || 1),
                )
              }
              className="w-full rounded-xl bg-white px-4 py-3 font-black text-black outline-none"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-orange-600">
          Comparison
        </p>

        <h2 className="mt-1 text-xl font-black text-black">
          Select Algorithms
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {ALGORITHMS.map((algorithm) => {
            const selected = state.selectedAlgorithms.includes(algorithm.id);

            return (
              <button
                key={algorithm.id}
                type="button"
                onClick={() => toggleComparison(algorithm.id)}
                className={`rounded-xl border px-3 py-3 text-left text-xs font-black transition ${
                  selected
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-neutral-200 bg-neutral-100 text-black hover:border-orange-400"
                }`}
              >
                {algorithm.id}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs font-medium leading-5 text-neutral-400">
          Pick at least two algorithms. You'll configure any extra inputs they
          need (like a time quantum for Round Robin) on the next screen.
        </p>
      </div>
    </div>
  );
});

function AlgorithmProcessTable({ algorithm, processes, onChange }) {
  const formId = useId();

  const updateRow = useCallback(
    (index, field, value) => {
      const next = processes.map((process, processIndex) =>
        processIndex === index
          ? {
              ...process,
              [field]:
                field === "id"
                  ? value.replace(/[^\w-]/g, "").slice(0, 12)
                  : Math.max(field === "bt" ? 1 : 0, Number(value) || 0),
            }
          : process,
      );

      onChange(next);
    },
    [processes, onChange],
  );

  const addProcess = useCallback(() => {
    const nextNumber = processes.length + 1;

    onChange([
      ...processes,
      { id: `P${nextNumber}`, at: 0, bt: 1, priority: 1 },
    ]);
  }, [processes, onChange]);

  const removeProcess = useCallback(
    (index) => {
      if (processes.length <= 1) return;
      onChange(processes.filter((_, processIndex) => processIndex !== index));
    },
    [processes, onChange],
  );

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={addProcess}
          className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-orange-600"
        >
          + Add
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-90 border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-100 text-left font-black uppercase tracking-wider text-black">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">AT</th>
              <th className="px-2 py-2">BT</th>
              <th className="px-2 py-2">Priority</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>

          <tbody>
            {processes.map((process, index) => (
              <tr
                key={`${formId}-${index}`}
                className="border-t border-neutral-200"
              >
                <td className="px-2 py-2">
                  <input
                    className={inputClass}
                    value={process.id}
                    onChange={(event) =>
                      updateRow(index, "id", event.target.value)
                    }
                    maxLength={12}
                    aria-label={`${algorithm} process ${index + 1} ID`}
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={process.at}
                    onChange={(event) =>
                      updateRow(index, "at", event.target.value)
                    }
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={process.bt}
                    onChange={(event) =>
                      updateRow(index, "bt", event.target.value)
                    }
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={process.priority}
                    onChange={(event) =>
                      updateRow(index, "priority", event.target.value)
                    }
                  />
                </td>

                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => removeProcess(index)}
                    className="rounded-lg bg-neutral-900 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={processes.length <= 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const ComparisonSetup = memo(function ComparisonSetup() {
  const { state, updateQuantum, updateProcessOverride } = useScheduler();

  return (
    <div>
      <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
          Per-algorithm input
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-neutral-600">
          Each algorithm below starts from the{" "}
          <span className="font-black text-black">
            {state.processes.length} process
            {state.processes.length === 1 ? "" : "es"}
          </span>{" "}
          configured in Step 1. Edit any value here to run that algorithm
          against different numbers without affecting the others.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {state.selectedAlgorithms.map((algorithm) => {
          const needsQuantum = QUANTUM_ALGORITHMS.includes(algorithm);
          const quantum = state.quantums[algorithm] ?? 2;
          const processes = state.processOverrides[algorithm] ?? state.processes;

          return (
            <div
              key={algorithm}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-widest text-orange-600">
                {algorithm}
              </p>

              <h3 className="mt-1 text-lg font-black text-black">
                {algorithmNames[algorithm]}
              </h3>

              {needsQuantum && (
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-black">
                    Time Quantum
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={quantum}
                    onChange={(event) =>
                      updateQuantum(
                        algorithm,
                        Math.max(1, Number(event.target.value) || 1),
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div className="mt-4">
                <AlgorithmProcessTable
                  algorithm={algorithm}
                  processes={processes}
                  onChange={(next) => updateProcessOverride(algorithm, next)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const GanttChart = memo(function GanttChart({ result }) {
  const maxTime = useMemo(
    () => Math.max(...result.gantt.map((segment) => segment.end), 1),
    [result.gantt],
  );

  return (
    <div className="overflow-x-auto rounded-xl bg-neutral-50 p-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-400 [&::-webkit-scrollbar-thumb:hover]:bg-orange-500">
      <div
        className="flex min-w-140"
        style={{ width: `${Math.max(100, maxTime * 90)}px` }}
      >
        {result.gantt.map((segment, index) => {
          const width = ((segment.end - segment.start) / maxTime) * 100;

          return (
            <motion.div
              key={`${segment.id}-${segment.start}-${index}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: `${width}%` }}
              className="origin-left"
            >
              <div
                className={`mx-px flex h-16 min-w-14 items-center justify-center rounded-xl px-2 text-center text-xs font-black text-white ${
                  segment.id === "IDLE"
                    ? "bg-neutral-400"
                    : segmentClasses[index % segmentClasses.length]
                }`}
              >
                {segment.id}
              </div>

              <div className="mt-2 flex justify-between px-1 text-[10px] font-bold text-neutral-500">
                <span>{segment.start}</span>
                <span>{segment.end}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export const ResultsTable = memo(function ResultsTable({ result }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
      <table className="w-full min-w-160 border-collapse text-sm">
        <thead>
          <tr className="bg-neutral-200 text-left text-xs font-black uppercase tracking-wider text-black">
            <th className="px-4 py-3">PID</th>
            <th className="px-4 py-3">AT</th>
            <th className="px-4 py-3">BT</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">CT</th>
            <th className="px-4 py-3">TAT</th>
            <th className="px-4 py-3">WT</th>
          </tr>
        </thead>

        <tbody>
          {result.rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="border-t border-neutral-200 text-black"
            >
              <td className="px-4 py-3 font-black text-orange-600">{row.id}</td>
              <td className="px-4 py-3">{row.at}</td>
              <td className="px-4 py-3">{row.bt}</td>
              <td className="px-4 py-3">{row.priority}</td>
              <td className="px-4 py-3 font-bold">{row.ct}</td>
              <td className="px-4 py-3 font-bold">{row.tat}</td>
              <td className="px-4 py-3 font-bold">{row.wt}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export const Statistics = memo(function Statistics({ result }) {
  const cards = [
    ["Average WT", formatNumber(result.averageWaiting)],
    ["Average TAT", formatNumber(result.averageTurnaround)],
    ["CPU Idle", formatNumber(result.idleTime)],
    ["Processes", result.rows.length],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(([label, value], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="rounded-xl bg-black p-4 text-white"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-orange-500">{value}</p>
        </motion.div>
      ))}
    </div>
  );
});

function bestBy(results, key) {
  return results.reduce((best, result) =>
    result[key] < best[key] ? result : best,
  );
}

const ComparisonSummary = memo(function ComparisonSummary({ results }) {
  const bestWaiting = useMemo(
    () => bestBy(results, "averageWaiting"),
    [results],
  );
  const bestTurnaround = useMemo(
    () => bestBy(results, "averageTurnaround"),
    [results],
  );
  const bestIdle = useMemo(() => bestBy(results, "idleTime"), [results]);

  return (
    <div className="mb-6 space-y-4">
      <p className="text-sm font-medium leading-6 text-neutral-600">
        {algorithmNames[bestWaiting.algorithm]} has the lowest average waiting
        time, {algorithmNames[bestTurnaround.algorithm]} has the lowest average
        turnaround time, and {algorithmNames[bestIdle.algorithm]} keeps the CPU
        idle the least among the selected algorithms.
      </p>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-140 border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-200 text-left text-xs font-black uppercase tracking-wider text-black">
              <th className="px-4 py-3">Algorithm</th>
              <th className="px-4 py-3">Avg WT</th>
              <th className="px-4 py-3">Avg TAT</th>
              <th className="px-4 py-3">Idle Time</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr
                key={result.algorithm}
                className="border-t border-neutral-200 text-black"
              >
                <td className="px-4 py-3 font-black text-orange-600">
                  {algorithmNames[result.algorithm]}
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatNumber(result.averageWaiting)}
                  {result.algorithm === bestWaiting.algorithm && (
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase text-orange-700">
                      Best
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatNumber(result.averageTurnaround)}
                  {result.algorithm === bestTurnaround.algorithm && (
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase text-orange-700">
                      Best
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatNumber(result.idleTime)}
                  {result.algorithm === bestIdle.algorithm && (
                    <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase text-orange-700">
                      Best
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export const Comparison = memo(function Comparison({ results }) {
  return (
    <div>
      <ComparisonSummary results={results} />

      <div className="grid gap-6">
        {results.map((result) => (
          <motion.div
            key={result.algorithm}
            layout
            className="overflow-hidden rounded-xl border border-neutral-200"
          >
            <div className="bg-black p-4 text-white">
              <h3 className="font-black">{algorithmNames[result.algorithm]}</h3>
              <p className="mt-1 text-xs text-neutral-400">
                {result.algorithm}
              </p>
            </div>

            <div className="p-4">
              <GanttChart result={result} />
            </div>

            <div className="grid grid-cols-3 gap-px bg-neutral-200">
              <div className="bg-white p-4">
                <p className="text-[10px] font-black uppercase text-neutral-500">
                  Avg WT
                </p>
                <p className="mt-1 font-black text-black">
                  {formatNumber(result.averageWaiting)}
                </p>
              </div>

              <div className="bg-white p-4">
                <p className="text-[10px] font-black uppercase text-neutral-500">
                  Avg TAT
                </p>
                <p className="mt-1 font-black text-black">
                  {formatNumber(result.averageTurnaround)}
                </p>
              </div>

              <div className="bg-white p-4">
                <p className="text-[10px] font-black uppercase text-neutral-500">
                  Idle
                </p>
                <p className="mt-1 font-black text-black">
                  {formatNumber(result.idleTime)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});