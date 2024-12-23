import { createRoot } from "react-dom/client";
import Builder from "./components/Builder.js";
import Instructions from "./components/Instructions.js";
import "./styles/app.css";

function App() {
  return (
    <div>
      <Instructions />
      <Builder />
    </div>
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
