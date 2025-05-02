import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (typeof global === "undefined") {
  (window as unknown as typeof globalThis).global = window;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
