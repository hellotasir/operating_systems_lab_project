import { memo } from "react";
import { motion } from "motion/react";
import { formatNumber } from "../shared/helpers";

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