import { useCallback, useId } from "react";
import { inputClass } from "../shared/helpers";

export function AlgorithmProcessTable({ algorithm, processes, onChange }) {
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