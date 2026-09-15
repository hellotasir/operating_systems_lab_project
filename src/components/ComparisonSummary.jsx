import { memo, useMemo } from "react";
import { algorithmNames, bestBy, formatNumber } from "../shared/helpers";

export const ComparisonSummary = memo(function ComparisonSummary({ results }) {
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