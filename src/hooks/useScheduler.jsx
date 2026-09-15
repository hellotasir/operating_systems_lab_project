import { useContext, useMemo } from "react";
import { SchedulerContext } from "../context/SchedulerContext";
import { getAlgorithmProcesses, runScheduler } from "../utils/Scheduler";

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used inside SchedulerProvider");
  }
  return context;
}

export function useAlgorithmResult() {
  const { state } = useScheduler();
  const quantum = state.quantums[state.algorithm] ?? 2;

  return useMemo(
    () => runScheduler(state.algorithm, state.processes, quantum),
    [state.algorithm, state.processes, quantum]
  );
}

export function useComparisonResults() {
  const { state } = useScheduler();

  return useMemo(
    () =>
      state.selectedAlgorithms.map((algorithm) =>
        runScheduler(
          algorithm,
          getAlgorithmProcesses(state, algorithm),
          state.quantums[algorithm] ?? 2
        )
      ),
    [state]
  );
}