import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { testTelegram } from "./integrations/telegram.js";
import "./ga4.js";
import "./styles.css";

window.testTelegram = testTelegram;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
