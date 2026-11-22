/**
 * PetSense AI · experiment results → Google Sheet
 *
 * Setup (about 2 minutes):
 * 1. Create a Google Sheet (e.g. "PetSense experiments").
 * 2. Extensions → Apps Script. Delete the sample code, paste this whole file, and save.
 * 3. Deploy → New deployment → type "Web app".
 *    Execute as: Me. Who has access: Anyone. Click Deploy and allow access.
 * 4. Copy the Web app URL (ends in /exec) and give it to Yerin.
 *
 * The app's server sends rows here. Rows land in a "Results" tab that this script creates.
 * Each row has an id, so a resend after a network error never creates a duplicate.
 * "attempt" counts how many times this participant has done this experiment (1 = first try).
 * Only attempt 1 counts in the results; later attempts are redos after a technical problem.
 * If you edit this script later, use Deploy → Manage deployments → edit → New version,
 * so the URL stays the same.
 */

const SHEET_NAME = 'Results';
const HEADERS = [
  'received_at',
  'participant',
  'experiment',
  'version',
  'attempt',
  'choice',
  'seconds',
  'correct',
  'detail',
  'platform',
  'client_time',
  'id',
];

function doGet() {
  return json_({ ok: true, service: 'petsense-study' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const rows = Array.isArray(data.rows) ? data.rows : [];
    const sheet = getSheet_();

    const last = sheet.getLastRow();
    const existing = last > 1 ? sheet.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];
    const col = (name) => HEADERS.indexOf(name);
    const seen = new Set(existing.map((r) => String(r[col('id')])));
    const attempts = {};
    existing.forEach((r) => {
      const key = r[col('participant')] + '|' + r[col('experiment')];
      attempts[key] = (attempts[key] || 0) + 1;
    });

    let added = 0;
    rows.forEach((r) => {
      if (!r || !r.id || seen.has(String(r.id))) return;
      const key = safe_(r.participant) + '|' + safe_(r.experiment);
      attempts[key] = (attempts[key] || 0) + 1;
      sheet.appendRow([
        new Date(),
        safe_(r.participant),
        safe_(r.experiment),
        safe_(r.version),
        attempts[key],
        safe_(r.choice),
        typeof r.seconds === 'number' ? r.seconds : '',
        typeof r.correct === 'boolean' ? r.correct : '',
        safe_(r.detail),
        safe_(r.platform),
        safe_(r.client_time),
        safe_(r.id),
      ]);
      seen.add(String(r.id));
      added++;
    });
    return json_({ ok: true, added: added });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0].join() !== HEADERS.join()) {
    // The columns changed in a script update: refresh the header row.
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  return sheet;
}

// Text that starts with = + - @ would run as a formula in Sheets, so store it as plain text.
function safe_(v) {
  if (v === undefined || v === null) return '';
  const s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
