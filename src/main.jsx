import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { testTelegram } from "./integrations/telegram.js";
import "./styles.css";

/** В консоли: testTelegram() — в dev с .env уходит в TG через Vite-прокси, в prod — в GAS (нужен Code.gs). */
window.testTelegram = testTelegram;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
