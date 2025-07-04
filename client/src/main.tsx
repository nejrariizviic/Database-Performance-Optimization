import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MiniProfilerProvider } from "./context/MiniProfiler.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MiniProfilerProvider>
      <App />
    </MiniProfilerProvider>
  </StrictMode>
);