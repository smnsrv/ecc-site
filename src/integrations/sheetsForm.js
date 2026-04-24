/**
 * Web App Google Apps Script: вставьте сюда URL развёрнутого веб-приложения
 * (Развёртывание → веб-приложение, доступ: «Все»).
 */
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3rc4XYEBBckNb3PVvGcKKpXg9gPA0Ouq0l7x_7PrtpZZZ2ILJ_TmF0Xj59RywzWQR/exec";

/**
 * Пример doPost() в Code.gs (добавьте ID таблицы и при необходимости лист):
 *
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var sh = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheets()[0];
 *     sh.appendRow([
 *       data.dateTime,
 *       data.productType,
 *       data.country,
 *       data.contact,
 *       data.email,
 *       data.source
 *     ]);
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ ok: true }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (err) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 *
 * В первой строке листа задайте заголовки: dateTime | productType | country | contact | email | source
 */

export async function postConsultationToSheets(payload) {
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
    /* тело не JSON */
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
}
