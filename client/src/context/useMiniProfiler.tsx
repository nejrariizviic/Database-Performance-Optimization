import { useContext } from "react";
import { MiniProfilerContext } from "./MiniProfiler";

function useMiniProfiler() {
  const context = useContext(MiniProfilerContext);
  if (!context) {
    throw new Error("Out of context");
  }
  return context;
}

export { useMiniProfiler };
