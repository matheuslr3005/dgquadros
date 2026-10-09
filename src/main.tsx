import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/hero.css";
import "./styles/services.css";
import "./styles/fleet.css";
import "./styles/leveling.css";
import "./styles/process.css";
import "./styles/quote.css";
import "./styles/footer.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
