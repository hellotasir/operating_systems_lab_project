import { ALGORITHMS } from "../utils/Scheduler";

export const algorithmNames = Object.fromEntries(
  ALGORITHMS.map((algorithm) => [algorithm.id, algorithm.name]),
);

export const segmentClasses = [
  "bg-orange-400",
  "bg-orange-500",
  "bg-orange-600",
  "bg-neutral-800",
  "bg-neutral-600",
  "bg-orange-300",
];

export const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-black outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export const noScrollbar =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export function formatNumber(value) {
  return Number(value).toFixed(2);
}

export function bestBy(results, key) {
  return results.reduce((best, result) =>
    result[key] < best[key] ? result : best,
  );
}