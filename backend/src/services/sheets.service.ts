import { getSheetsClient, SHEET_ID, SHEET_TAB } from '../config/sheets';

interface SheetRowData {
  applicationId: string;
  jobTitle: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
  appliedAt: string;
}

// Header row — written once when the sheet is first populated.
// If the sheet already has headers, this is skipped (checked by row count).
const HEADERS = [
  'Application ID',
  'Job Title',
  'Company',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Cover Letter',
  'Resume URL',
  'Applied At',
];

export async function appendApplicationToSheet(data: SheetRowData): Promise<void> {
  if (!SHEET_ID) {
    console.warn('⚠️  GOOGLE_SHEETS_ID not set — skipping Sheets append');
    return;
  }

  const sheets = getSheetsClient();
  const range = `${SHEET_TAB}!A:A`;

  // Check if header row exists
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });

  const rowCount = existing.data.values?.length ?? 0;

  // Build the row values
  const row = [
    data.applicationId,
    data.jobTitle,
    data.company,
    data.firstName,
    data.lastName,
    data.email,
    data.phone ?? '',
    data.coverLetter,
    data.resumeUrl ?? '',
    data.appliedAt,
  ];

  const valuesToAppend = rowCount === 0 ? [HEADERS, row] : [row];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: valuesToAppend },
  });
}
