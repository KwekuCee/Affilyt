import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/sora/wght.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
