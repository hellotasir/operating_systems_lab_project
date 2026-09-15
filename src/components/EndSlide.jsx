import { memo } from "react";
import { useScheduler } from "../hooks/useScheduler";

export const EndSlide = memo(function EndSlide() {
  const { reset } = useScheduler();

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium leading-6 text-neutral-600 sm:text-base">
        You have walked through process configuration, algorithm selection, the
        resulting schedule, and a side-by-side comparison. Restart to try a
        different set of processes.
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
      >
        Run Again
      </button>
    </div>
  );
});