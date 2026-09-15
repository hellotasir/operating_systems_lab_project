import { AnimatePresence, motion } from "motion/react";
import { IntroSlide } from "./components/IntroSlide";
import { IdentitySlide } from "./components/IndentitySlide";
import { ProcessInput } from "./components/ProcessInput";
import { AlgorithmSelector } from "./components/AlgorithmSelector";
import {
  useAlgorithmResult,
  useComparisonResults,
  useScheduler,
} from "./hooks/useScheduler";
import { Statistics } from "./components/Statistics";
import { GanttChart } from "./components/GantChart";
import { ResultsTable } from "./components/ResultTable";
import { ComparisonSetup } from "./components/ComparisonSetup";
import { Comparison } from "./components/Comparison";
import { EndSlide } from "./components/EndSlide";
import { StepFrame } from "./components/Stepframe";
import { useDisableContextMenu } from "./hooks/useDisableContextMenu";
import { SchedulerProvider } from "./context/SchedulerProvider";

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -48 : 48 }),
};

function StepBody({ stepId }) {
  const result = useAlgorithmResult();
  const comparisonResults = useComparisonResults();

  switch (stepId) {
    case "intro":
      return <IntroSlide />;
    case "identity":
      return <IdentitySlide />;
    case "input":
      return <ProcessInput />;
    case "algorithm":
      return <AlgorithmSelector />;
    case "results":
      return (
        <div className="space-y-6">
          <Statistics result={result} />
          <GanttChart result={result} />
          <ResultsTable result={result} />
        </div>
      );
    case "compare-setup":
      return <ComparisonSetup />;
    case "comparison":
      return <Comparison results={comparisonResults} />;
    case "end":
      return <EndSlide />;
    default:
      return null;
  }
}

function Dashboard() {
  const { currentStep, direction, reset } = useScheduler();

  return (
    <div className="flex h-screen w-screen flex-col gap-3 overflow-hidden bg-orange-500 p-3 sm:p-4">
      <div className="flex items-center justify-between px-2 sm:px-3">
        <p className="text-xs font-black uppercase tracking-widest text-orange-50">
          CPU Scheduling Visualizer
        </p>

        <button
          type="button"
          onClick={reset}
          className="text-xs font-black uppercase tracking-widest text-orange-50 opacity-80 transition hover:opacity-100"
        >
          Restart
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-1">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="col-start-1 row-start-1 h-full w-full overflow-hidden"
          >
            <StepFrame
              eyebrow={currentStep.eyebrow}
              title={currentStep.title}
              description={currentStep.description}
            >
              <StepBody stepId={currentStep.id} />
            </StepFrame>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  useDisableContextMenu();
  return (
    <SchedulerProvider>
      <Dashboard />
    </SchedulerProvider>
  );
}
