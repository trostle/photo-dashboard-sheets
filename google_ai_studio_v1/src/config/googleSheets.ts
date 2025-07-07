// Google Sheets Configuration
export const GOOGLE_SHEETS_CONFIG = {
  apiKey: process.env.VITE_GOOGLE_SHEETS_API_KEY || "",
  spreadsheetId: process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || "",
  range: process.env.VITE_GOOGLE_SHEETS_RANGE || "Sheet1!A1:Z1000",
};

// Validate configuration
export const validateGoogleSheetsConfig = (): boolean => {
  if (!GOOGLE_SHEETS_CONFIG.apiKey) {
    console.error(
      "Google Sheets API key is missing. Please set VITE_GOOGLE_SHEETS_API_KEY in your environment variables."
    );
    return false;
  }

  if (!GOOGLE_SHEETS_CONFIG.spreadsheetId) {
    console.error(
      "Google Sheets spreadsheet ID is missing. Please set VITE_GOOGLE_SHEETS_SPREADSHEET_ID in your environment variables."
    );
    return false;
  }

  return true;
};

// Expected Google Sheets column structure
export const SHEET_COLUMNS = {
  SOURCE: "A",
  ID: "C",
  PAGE_LINK: "G",
  IMAGE_LINK: "H",
  TAGS: "O",
  PHOTOGRAPHER_NAME: "P",
  ORIENTATION: "U",
  APPROVE: "V",
} as const;

// Column indexes (0-based) for array access
export const COLUMN_INDEXES = {
  SOURCE: 0, // A
  ID: 2, // C
  PAGE_LINK: 6, // G
  IMAGE_LINK: 7, // H
  TAGS: 14, // O
  PHOTOGRAPHER_NAME: 15, // P
  ORIENTATION: 20, // U
  APPROVE: 21, // V
} as const;
