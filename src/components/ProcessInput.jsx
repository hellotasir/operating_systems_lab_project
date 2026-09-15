import { memo, useCallback, useId } from "react";
import { motion } from "motion/react";
import { useScheduler } from "../hooks/useScheduler";
import { inputClass } from "../shared/helpers";

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