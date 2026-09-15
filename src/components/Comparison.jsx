import { memo } from "react";
import { motion } from "motion/react";
import { GanttChart } from "./GantChart";
import { algorithmNames, formatNumber } from "../shared/helpers";
import { ComparisonSummary } from "./ComparisonSummary";

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