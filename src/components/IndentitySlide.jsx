import { memo } from "react";

export const IdentitySlide = memo(function IdentitySlide() {
  return (
   <div className="space-y-8 text-neutral-600">
  <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
      Course details
    </h3>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Course title: Operating Systems Lab
    </p>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Course code: CSE362
    </p>
    <p className="text-lg font-medium leading-7 sm:text-xl">Section: 04</p>
    <p className="text-lg font-medium leading-7 sm:text-xl">
      Project Title: Designing algorithm visualizer for CPU scheduling
      algorithms
    </p>
  </div>

  <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
      Group members
    </h3>
    <div className="space-y-3">
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Tasir Rahman, ID: 2023100000371, Batch: 64
      </p>
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Azizul Hakim Omor, ID: 2023100000012, Batch: 64
      </p>
      <p className="text-lg font-medium leading-7 sm:text-xl md:text-2xl">
        Name: Saiful Islam Riad, ID: 2023000000022, Batch: 63
      </p>
    </div>
  </div>
</div>
  );
});