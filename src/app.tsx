import { createRoot } from "react-dom/client";
import Builder from "./components/Builder.js";
import Header from "./components/Header.js";
import Instructions from "./components/Instructions.js";
import "./styles/app.css";

function App() {
  return (
    <div>
      <main>
        <Header />
        <Builder />
        <Instructions />
      </main>
    </div>
  );
}

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
