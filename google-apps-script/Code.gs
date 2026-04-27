// Script properties: TG_TOKEN, TG_CHAT_ID (через , | ;). В хвосте письма — id чата, без getChat (экономит квоту GAS).
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

function parseChatIds_(raw) {
  if (raw == null) return [];
  return String(raw)
    .split(/[,;|]/)
    .map(function (s) {
      return s.trim();
    })
    .filter(function (s) {
      return s.length > 0;
    });
}

function escapeTgHtml_(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Без getChat: на каждого получателя один UrlFetch (sendMessage), иначе GAS — «Bandwidth quota exceeded».
function formatRecipientFooterHtml_(chatId) {
  return "\n\n—\n<i>Получатель · id " + escapeTgHtml_(String(chatId)) + "</i>";
}

function formatRecipientFooterPlain_(chatId) {
  return "\n\n—\nПолучатель · id " + String(chatId);
}

/** Повтор + пауза, если GAS кинул Bandwidth quota (часто вторая sendMessage подряд) */
function urlFetchTelegram_(url, options) {
  var lastErr = null;
  for (var i = 0; i < 5; i++) {
    try {
      if (i > 0) {
        Utilities.sleep(2000 * i);
      }
      return UrlFetchApp.fetch(url, options);
    } catch (e) {
      lastErr = e;
      var s = String(e);
      if (s.indexOf("Bandwidth") === -1 && s.indexOf("quota") === -1 && s.indexOf("Service invoked") === -1) {
        throw e;
      }
    }
  }
  throw lastErr;
}

function sendOneTgMessage_(url, chatId, html) {
  var toId = /^\d+$/.test(String(chatId)) ? Number(chatId) : String(chatId);
  var body = html + formatRecipientFooterHtml_(chatId);
  try {
    var res = urlFetchTelegram_(url, {
      method: "post",
      contentType: "application/json",
      muteHttpExceptions: true,
      payload: JSON.stringify({
        chat_id: toId,
        text: body,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    var j = JSON.parse(res.getContentText());
    if (j.ok) return { ok: true, chat: chatId };
    if (j.error_code === 400 && j.description && j.description.indexOf("parse") !== -1) {
      var basePlain = html.replace(/<[^>]+>/g, " ");
      var plain = basePlain + formatRecipientFooterPlain_(chatId);
      res = urlFetchTelegram_(url, {
        method: "post",
        contentType: "application/json",
        muteHttpExceptions: true,
        payload: JSON.stringify({
          chat_id: toId,
          text: plain,
          disable_web_page_preview: true,
        }),
      });
      j = JSON.parse(res.getContentText());
      if (j.ok) return { ok: true, chat: chatId, fallback: "plain" };
    }
    return { ok: false, chat: chatId, error: j.description || res.getContentText() };
  } catch (e) {
    return { ok: false, chat: chatId, error: String(e) };
  }
}

function sendTelegram_(html) {
  var p = PropertiesService.getScriptProperties();
  var token = (p.getProperty("TG_TOKEN") || "").trim();
  var chatIdRaw = p.getProperty("TG_CHAT_ID");
  if (!token || chatIdRaw === null || String(chatIdRaw) === "") {
    return { sent: false, error: "no TG_TOKEN or TG_CHAT_ID" };
  }
  var ids = parseChatIds_(chatIdRaw);
  if (!ids.length) {
    return { sent: false, error: "no TG_TOKEN or TG_CHAT_ID" };
  }
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var results = [];
  var allOk = true;
  for (var i = 0; i < ids.length; i++) {
    var r = sendOneTgMessage_(url, ids[i], html);
    results.push(r);
    if (!r.ok) allOk = false;
    if (i < ids.length - 1) {
      Utilities.sleep(4000);
    }
  }
  if (allOk) return { sent: true, ok: true, to: ids.length, results: results };
  return { sent: false, ok: false, to: ids.length, results: results, error: "one or more sends failed" };
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}


function testFromEditor() {
  var t = "Тест из Google Apps Script: " + new Date().toISOString();
  var r = sendTelegram_(t);
  Logger.log(JSON.stringify(r, null, 2));
  if (r && r.results) {
    for (var i = 0; i < r.results.length; i++) {
      var x = r.results[i];
      if (x.ok) {
        Logger.log("OK chat_id " + x.chat);
      } else {
        Logger.log("FAIL chat_id " + x.chat + ": " + (x.error || "unknown"));
      }
    }
  }
  if (r && r.sent) {
    Logger.log("Все чаты: доставка успешна.");
  } else {
    Logger.log("Есть неудачные. Часто: /start боту не с этим id, неверный id, бот в блоке, или id группы без добавления бота в группу.");
  }
}
