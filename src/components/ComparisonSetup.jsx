import { memo } from "react";
import { useScheduler } from "../hooks/useScheduler";
import { QUANTUM_ALGORITHMS } from "../utils/Scheduler";
import { algorithmNames, inputClass } from "../shared/helpers";
import { AlgorithmProcessTable } from "./AlgorithmProcessTable";

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