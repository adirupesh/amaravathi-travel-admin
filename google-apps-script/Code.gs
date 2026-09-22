const SHEET_ID = "1E_c7C4cH0-HInUu0-YWEvdKKaGQZfz4MNIClS6bqUjw";
const SHEET_NAME = "Sheet1";
const SYNC_TOKEN = "SET_THE_SAME_PRIVATE_SYNC_TOKEN_AS_THE_SITE";
const HEADERS = ["id", "type", "name", "location", "description", "price", "status", "imageKey", "createdAt", "updatedAt"];

function doGet(e) {
  if (!e || e.parameter.token !== SYNC_TOKEN) return json({ error: "Unauthorized" });
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return json({ items: [] });
  const items = values.slice(1).filter(row => row[0] !== "").map(row => Object.fromEntries(HEADERS.map((key, i) => [key, key === "price" && row[i] !== "" ? Number(row[i]) : row[i] || null])));
  return json({ items });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    if (payload.token !== SYNC_TOKEN) return json({ error: "Unauthorized" });
    const sheet = getSheet();
    if (payload.action === "replace" && Array.isArray(payload.items)) {
      sheet.clearContents();
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      if (payload.items.length) sheet.getRange(2, 1, payload.items.length, HEADERS.length).setValues(payload.items.map(item => HEADERS.map(key => item[key] == null ? "" : item[key])));
      return json({ ok: true, count: payload.items.length });
    }
    return json({ error: "Unsupported action" });
  } catch (error) {
    return json({ error: String(error) });
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  return sheet;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

