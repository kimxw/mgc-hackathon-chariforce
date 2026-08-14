// Google Apps Script Web App URL that appends consultation-form submissions
// to a Sheet. Deploy: open a Google Sheet -> Extensions > Apps Script ->
// replace Code.gs with:
//
//   function doPost(e) {
//     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     const data = JSON.parse(e.postData.contents);
//     sheet.appendRow([new Date(data.ts), data.email]);
//     return ContentService.createTextOutput('ok');
//   }
//
// -> Deploy > New deployment > type "Web app" > execute as "Me" > who has
// access "Anyone" > Deploy. Paste the resulting /exec URL below.
export const LEADS_ENDPOINT = '';
