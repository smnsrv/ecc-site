// GAS: полный https:// URL веб-приложения (script.google.com/macros/.../exec), доступ «Все».
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwRCDqxM_DuNzs2V5P4eRBg__Xb2ES2iz_wachlXdT5321OMoOX8epJtkrmW2y-gX2u/exec";

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

export async function postJsonToGoogleScript(payload) {
  const cfg = getSheetsUrlConfigError();
  if (cfg) {
    const e = new Error(cfg);
    e.sheetsConfigCode = cfg;
    throw e;
  }

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
    throw err;
  }

  if (data && data.ok === false) {
    const err = new Error(data.error || "ok: false");
    err.response = data;
    throw err;
  }
  return data;
}

export async function postConsultationToSheets(payload) {
  return postJsonToGoogleScript(payload);
}
