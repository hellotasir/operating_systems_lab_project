import { memo, useCallback } from "react";
import { useScheduler } from "../hooks/useScheduler";
import { ALGORITHMS, QUANTUM_ALGORITHMS } from "../utils/Scheduler";

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