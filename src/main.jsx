import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { testTelegram } from "./integrations/telegram.js";
import "./styles.css";

if (import.meta.env.DEV) {
  window.testTelegram = testTelegram;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
