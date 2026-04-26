function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "no body" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var data = JSON.parse(e.postData.contents);
    var sheetId = "1PLQ9OXApw9l5hd5uADfarbTxik8jmS6HqTkniRc-Ie0";
    var sh = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sh.appendRow([
      data.dateTime || "",
      data.productType || "",
      data.country || "",
      data.contact || "",
      data.email || "",
      data.source || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

var SHEET_ID = "1PLQ9OXApw9l5hd5uADfarbTxik8jmS6HqTkniRc-Ie0";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonOut_({ ok: false, error: "no body" });
    }
    var data = JSON.parse(e.postData.contents);

    // Таблица: только полная заявка со страницы «Контакты» (сайт шлёт dateTime)
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

    // Telegram: и с «Контактов» (в payload есть telegramText), и CTA с главной
    if (data.telegramText) {
      sendTelegram_(data.telegramText);
    }

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function sendTelegram_(html) {
  var p = PropertiesService.getScriptProperties();
  var token = p.getProperty("TG_TOKEN");
  var chatId = p.getProperty("TG_CHAT_ID");
  if (!token || !chatId) {
    return;
  }
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  UrlFetchApp.fetch(url, {
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
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
