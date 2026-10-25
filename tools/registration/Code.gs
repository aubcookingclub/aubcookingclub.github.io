/**
 * AUB Cooking Club – workshop sign-ups → this Google Sheet.
 *
 * Paste this whole file into the sheet's Extensions → Apps Script, run `setup` once,
 * then deploy it as a web app (see SETUP.md next to this file).
 *
 * What it does
 *  - The website's sign-up form sends each registration here; it becomes a new row in "Sign-ups".
 *  - You get an email for every new sign-up (turn off in the "Settings" tab).
 *  - Tick "Accepted" on a row and a "Send WhatsApp" link appears: tap it, WhatsApp opens with that
 *    person's number and the acceptance message (edit the message in "Settings"). Then tick "Messaged".
 *  - New questions on the website automatically get their own column.
 *
 * Nothing secret lives in this file; it is safe to keep in the public website repository.
 */

const SHEET = 'Sign-ups';
const SETTINGS = 'Settings';
// Fixed columns (A–G). The WhatsApp link formula depends on this order, so don't move these columns.
const FIXED = ['Received', 'Workshop', 'Accepted', 'Send WhatsApp', 'Messaged', 'Name', 'WhatsApp number'];
const DEFAULT_MESSAGE =
  "Hi {first}! 🎉 Congratulations, you've been accepted to the AUB Cooking Club workshop: {workshop}. " +
  "We can't wait to cook with you! 🍝";

/** Run once from the Apps Script editor (it also runs automatically on the first sign-up). */
function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET, 0);
  if (sh.getLastRow() === 0) sh.appendRow(FIXED);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#A5B49C');
  sh.getRange('G:G').setNumberFormat('@'); // phone numbers stay as text
  sh.setColumnWidth(1, 150); sh.setColumnWidth(4, 140); sh.setColumnWidth(6, 180); sh.setColumnWidth(7, 150);

  const st = ss.getSheetByName(SETTINGS) || ss.insertSheet(SETTINGS);
  if (!st.getRange('A1').getValue()) {
    st.getRange('A1:B2').setValues([
      ['Acceptance message', DEFAULT_MESSAGE],
      ['Email me each new sign-up (yes/no)', 'yes']
    ]);
    st.getRange('A4').setValue('In the message you can use {first} (first name), {name} (full name) and {workshop}.');
    st.getRange('A1:A2').setFontWeight('bold');
    st.setColumnWidth(1, 270); st.setColumnWidth(2, 560);
    st.getRange('B1').setWrap(true);
  }
}

/** Visiting the web-app URL in a browser shows this, so you can check it's deployed. */
function doGet() {
  return json_({ ok: true, service: 'AUB Cooking Club sign-ups' });
}

/** Receives one sign-up from the website. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const name = clean_(d.name);
    const phone = String(d.phone || '').replace(/\D/g, '');
    const workshop = clean_(d.workshop) || 'Workshop';
    const answers = d.answers && typeof d.answers === 'object' ? d.answers : {};
    if (!name || phone.length < 10) return json_({ ok: false, error: 'Missing name or phone number' });
    if (Number(d.secondsOnPage) < 3) return json_({ ok: false, error: 'Please try again' }); // filled in too fast: likely a bot

    const ss = SpreadsheetApp.getActive();
    if (!ss.getSheetByName(SHEET) || !ss.getSheetByName(SETTINGS)) setup();
    const sh = ss.getSheetByName(SHEET);

    // Give any new question its own column.
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    Object.keys(answers).forEach(q => {
      if (header.indexOf(q) === -1) {
        sh.getRange(1, header.length + 1).setValue(q).setFontWeight('bold').setBackground('#A5B49C');
        header.push(q);
      }
    });

    const duplicate = isDuplicate_(sh, phone, workshop);
    const row = header.map(h => {
      switch (h) {
        case 'Received': return new Date();
        case 'Workshop': return workshop;
        case 'Accepted': case 'Messaged': return false;
        case 'Send WhatsApp': return '';
        case 'Name': return name;
        case 'WhatsApp number': return phone;
        default: return clean_(answers[h] === undefined ? '' : answers[h]);
      }
    });
    sh.appendRow(row);
    const r = sh.getLastRow();
    sh.getRange(r, 7).setNumberFormat('@').setValue(phone);
    sh.getRange(r, 3).insertCheckboxes();
    sh.getRange(r, 5).insertCheckboxes();
    sh.getRange(r, 4).setFormula(waFormula_(r));
    if (duplicate) {
      sh.getRange(r, 1, 1, header.length).setBackground('#F1DAA4');
      sh.getRange(r, 6).setNote('This number already signed up for this workshop.');
    }

    notify_(ss, name, phone, workshop, answers, duplicate);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/** Column D: once "Accepted" (C) is ticked, a link that opens WhatsApp with the message ready to send. */
function waFormula_(r) {
  const msg = `SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(${SETTINGS}!$B$1,"{first}",REGEXEXTRACT(F${r}&" ","^\\S+")),"{name}",F${r}),"{workshop}",B${r})`;
  return `=IF(C${r},HYPERLINK("https://wa.me/"&G${r}&"?text="&ENCODEURL(${msg}),"Send WhatsApp ✉"),"")`;
}

function isDuplicate_(sh, phone, workshop) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return false;
  const rows = sh.getRange(2, 2, n, 6).getValues(); // B..G
  return rows.some(v => String(v[0]) === workshop && String(v[5]).replace(/\D/g, '') === phone);
}

function notify_(ss, name, phone, workshop, answers, duplicate) {
  const st = ss.getSheetByName(SETTINGS);
  if (String(st.getRange('B2').getValue()).trim().toLowerCase() === 'no') return;
  const me = Session.getEffectiveUser().getEmail();
  if (!me) return;
  const lines = [
    `${name} signed up for ${workshop}.`,
    `WhatsApp: +${phone}`,
    ...Object.keys(answers).map(q => `${q}: ${answers[q] || '—'}`),
    duplicate ? '\nNote: this number had already signed up for this workshop.' : '',
    `\nOpen the list: ${ss.getUrl()}`
  ];
  MailApp.sendEmail(me, `New sign-up: ${name} (${workshop})`, lines.join('\n'));
}

/** Trim, cap length, and stop answers being read as spreadsheet formulas. */
function clean_(v) {
  let s = String(v === null || v === undefined ? '' : v).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
