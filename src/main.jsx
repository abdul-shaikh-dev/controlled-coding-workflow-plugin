import React from "react";
import { createRoot } from "react-dom/client";
import CreditSimulator from "../skills/controlled-coding-workflow/tools/copilot-credit-simulator.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CreditSimulator />
  </React.StrictMode>
);
