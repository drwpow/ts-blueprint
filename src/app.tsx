import { createRoot } from "react-dom/client";
import Instructions from "./components/instructions.js";
import Builder from "./components/builder.js";

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
