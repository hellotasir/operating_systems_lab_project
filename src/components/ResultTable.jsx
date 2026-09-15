import { memo } from "react";
import { motion } from "motion/react";

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