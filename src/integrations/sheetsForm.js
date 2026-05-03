// GAS: полный https:// URL веб-приложения (script.google.com/macros/.../exec), доступ «Все».
import { generateRequestId } from "../lib/requestId.js";
import { withExponentialBackoff } from "../lib/retry.js";

export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxvwYcw7h-3C1GAXIO5kUgrhXbrB_lCB1LNmYoL6rdSOV6P0FQ4sDio4XjEGl3XAAUm/exec";

const PLACEHOLDER = "PASTE GOOGLE APPS SCRIPT WEB APP URL HERE";

export function getSheetsUrlConfigError() {
  const u = (GOOGLE_SCRIPT_URL || "").trim();
  if (!u || u.includes(PLACEHOLDER)) {
    return "SHEETS_PLACEHOLDER";
  }
  if (!/^https:\/\//i.test(u)) {
    return "SHEETS_NOT_HTTPS";
  }
  if (!/script\.google\.com\/macros\//i.test(u)) {
    return "SHEETS_NOT_SCRIPT";
  }
  return null;
}

/**
 * Один запрос без повторов (внутренний).
 * @param {Record<string, unknown>} payload
 */
async function postJsonToGoogleScriptOnce(payload) {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON body
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    err.responseText = text;
    err.httpStatus = res.status;
    throw err;
  }

  if (data && data.ok === false) {
    const err = new Error(data.error || "ok: false");
    err.response = data;
    throw err;
  }
  return data;
}

function shouldRetryPost(err) {
  if (err && typeof err === "object" && "sheetsConfigCode" in err) return false;
  const st = err && typeof err === "object" && "httpStatus" in err ? err.httpStatus : null;
  if (st != null && st >= 400 && st < 500 && st !== 429) return false;
  return true;
}

/**
 * POST в GAS с ретраями при сетевых сбоях и 5xx/429.
 * Добавляет `_ecc_request_id` для идемпотентности повторов (GAS может дедуплицировать по полю).
 */
export async function postJsonToGoogleScript(payload) {
  const cfg = getSheetsUrlConfigError();
  if (cfg) {
    const e = new Error(cfg);
    e.sheetsConfigCode = cfg;
    throw e;
  }

  const enriched = {
    ...payload,
    _ecc_request_id:
      payload._ecc_request_id != null && payload._ecc_request_id !== ""
        ? payload._ecc_request_id
        : generateRequestId(),
  };

  return withExponentialBackoff(() => postJsonToGoogleScriptOnce(enriched), {
    maxAttempts: 3,
    shouldRetry: (err) => shouldRetryPost(err),
  });
}

export async function postConsultationToSheets(payload) {
  return postJsonToGoogleScript(payload);
}
