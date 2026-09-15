import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { segmentClasses } from "../shared/helpers";

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