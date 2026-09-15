import { memo } from "react";

export const IntroSlide = memo(function IntroSlide() {
  return (
    <div className="space-y-4 text-sm font-medium leading-6 text-neutral-600 sm:text-base">
      <p className="text-lg">
        Four processes arrive with their own arrival time, burst time, and
        priority. Step through First Come First Serve, Shortest Job First,
        Priority Scheduling, Round Robin, Shortest Remaining Time First, and
        Longest Job First to see how each one orders the CPU.
      </p>
      <p>Use the arrow in the corner to begin.</p>
    </div>
  );
});