import { google } from 'googleapis';

export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export const SHEET_ID = process.env.GOOGLE_SHEETS_ID ?? '';
export const SHEET_TAB = process.env.GOOGLE_SHEETS_TAB ?? 'Applications';

interface SheetRowData {
  applicationId: string;
  jobTitle: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  coverLetter: string;
  resumeUrl?: string;
  appliedAt: string;
}

const HEADERS = [
  'Application ID',
  'Job Title',
  'Company',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Current CTC',
  'Expected CTC',
  'Notice Period',
  'Cover Letter',
  'Resume URL',
  'Applied At',
];

export async function appendApplicationToSheet(data: SheetRowData): Promise<void> {
  if (!SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return;
  }

  try {
    const sheets = getSheetsClient();
    const range = `${SHEET_TAB}!A:A`;

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const rowCount = existing.data.values?.length ?? 0;

    const row = [
      data.applicationId,
      data.jobTitle,
      data.company,
      data.firstName,
      data.lastName,
      data.email,
      data.phone ?? '',
      data.currentCtc ?? '',
      data.expectedCtc ?? '',
      data.noticePeriod ?? '',
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
  } catch (err) {
    console.warn('[sheets] Failed to append application row:', err);
  }
}
