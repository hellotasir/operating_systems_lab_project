import { useCallback, useMemo, useReducer, useState } from "react";
import { SchedulerContext } from "./SchedulerContext";
import {
  ALGORITHMS,
  INITIAL_STATE,
  STEPS,
  canAdvanceFromStep,
  schedulerReducer,
} from "./scheduler";

export function SchedulerProvider({ children }) {
  const [state, dispatch] = useReducer(schedulerReducer, INITIAL_STATE);
  const [direction, setDirection] = useState(1);

  const updateProcesses = useCallback((processes) => {
    dispatch({ type: "SET_PROCESSES", payload: processes });
  }, []);

  const updateAlgorithm = useCallback((algorithm) => {
    dispatch({ type: "SET_ALGORITHM", payload: algorithm });
  }, []);

  const updateQuantum = useCallback((algorithm, quantum) => {
    dispatch({ type: "SET_QUANTUM", payload: { algorithm, quantum } });
  }, []);

  const updateComparison = useCallback((algorithms) => {
    dispatch({ type: "SET_COMPARISON", payload: algorithms });
  }, []);

  const updateProcessOverride = useCallback((algorithm, processes) => {
    dispatch({ type: "SET_PROCESS_OVERRIDE", payload: { algorithm, processes } });
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    dispatch({ type: "PREV_STEP" });
  }, []);

  const reset = useCallback(() => {
    setDirection(-1);
    dispatch({ type: "RESET" });
  }, []);

  const currentStep = STEPS[state.stepIndex];
  const canGoBack = state.stepIndex > 0;
  const isLastStep = state.stepIndex === STEPS.length - 1;
  const canGoNext = !isLastStep && canAdvanceFromStep(currentStep.id, state);

  const value = useMemo(
    () => ({
      state,
      algorithms: ALGORITHMS,
      steps: STEPS,
      currentStep,
      direction,
      canGoNext,
      canGoBack,
      isLastStep,
      updateProcesses,
      updateAlgorithm,
      updateQuantum,
      updateComparison,
      updateProcessOverride,
      goNext,
      goBack,
      reset,
    }),
    [
      state,
      currentStep,
      direction,
      canGoNext,
      canGoBack,
      isLastStep,
      updateProcesses,
      updateAlgorithm,
      updateQuantum,
      updateComparison,
      updateProcessOverride,
      goNext,
      goBack,
      reset,
    ]
  );

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
}