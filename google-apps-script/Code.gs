/**
 * Вставь ВЕСЬ этот файл в Apps Script (замени всё в Code.gs).
 * Свойства сценария: TG_TOKEN, TG_CHAT_ID
 */
var SHEET_ID = "1PLQ9OXApw9l5hd5uADfarbTxik8jmS6HqTkniRc-Ie0";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonOut_({ ok: false, error: "no body" });
    }
    var data = JSON.parse(e.postData.contents);
    var tgResult = null;

    if (data.dateTime) {
      var sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
      sh.appendRow([
        data.dateTime || "",
        data.productType || "",
        data.country || "",
        data.contact || "",
        data.email || "",
        data.source || "",
      ]);
    }

    if (data.telegramText) {
      tgResult = sendTelegram_(data.telegramText);
    }

    return jsonOut_({ ok: true, telegram: tgResult || { sent: false, note: "no telegramText" } });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function sendTelegram_(html) {
  var p = PropertiesService.getScriptProperties();
  var token = (p.getProperty("TG_TOKEN") || "").trim();
  var chatIdRaw = p.getProperty("TG_CHAT_ID");
  if (!token || chatIdRaw === null || String(chatIdRaw) === "") {
    return { sent: false, error: "no TG_TOKEN or TG_CHAT_ID" };
  }
  var chatId = /^\d+$/.test(String(chatIdRaw)) ? Number(chatIdRaw) : String(chatIdRaw);
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  var j = JSON.parse(res.getContentText());
  if (j.ok) return { sent: true, ok: true };
  if (j.error_code === 400 && j.description && j.description.indexOf("parse") !== -1) {
    res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      muteHttpExceptions: true,
      payload: JSON.stringify({
        chat_id: chatId,
        text: html.replace(/<[^>]+>/g, " "),
        disable_web_page_preview: true,
      }),
    });
    j = JSON.parse(res.getContentText());
    if (j.ok) return { sent: true, ok: true, fallback: "plain" };
  }
  return { sent: false, ok: false, error: j.description || res.getContentText() };
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}


function testFromEditor() {
  var t = "Тест из Google Apps Script: " + new Date().toISOString();
  var r = sendTelegram_(t);
  Logger.log(r);
  if (r && r.sent) {
    Logger.log("OK: проверь Telegram");
  } else {
    Logger.log("ОШИБКА: " + JSON.stringify(r));
  }
}
