import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { MemoryRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <MemoryRouter>
    <App />
  </MemoryRouter>,
);
