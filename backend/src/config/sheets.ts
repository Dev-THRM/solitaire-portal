import { google } from 'googleapis';

// Authenticate using a service account — share your Google Sheet with the
// service account email to grant write access.
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
