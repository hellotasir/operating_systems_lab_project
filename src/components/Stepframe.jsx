import { memo } from "react";
import { noScrollbar } from "../shared/helpers";
import { NavIcon } from "./NavIcon";
import { useScheduler } from "../hooks/useScheduler";

export const StepFrame = memo(function StepFrame({
  eyebrow,
  title,
  description,
  children,
}) {
  const { goNext, goBack, canGoNext, canGoBack, isLastStep } = useScheduler();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div
        className={`flex-1 overflow-y-auto px-6 pt-8 sm:px-16 sm:pt-16 ${noScrollbar}`}
      >
        <div className="mx-auto w-screen max-w-[90%]">
          {eyebrow && (
            <p className="text-xs font-black uppercase tracking-widest text-orange-600">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-neutral-500 sm:text-base">
              {description}
            </p>
          )}

          <div className="mt-8 pb-4">{children}</div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 sm:px-16 sm:pb-12">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Previous step"
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-200 text-black transition hover:bg-neutral-300 ${
            canGoBack ? "" : "invisible"
          }`}
        >
          <NavIcon direction="left" />
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next step"
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
            isLastStep
              ? "invisible"
              : canGoNext
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "cursor-not-allowed bg-neutral-200 text-neutral-400"
          }`}
        >
          <NavIcon direction="right" />
        </button>
      </div>
    </div>
  );
});