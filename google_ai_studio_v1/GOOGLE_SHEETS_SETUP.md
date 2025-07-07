# Google Sheets Integration Setup

This guide will help you set up Google Sheets as your photo database for the Photo Management Dashboard.

## Prerequisites

- A Google account
- A Google Sheets spreadsheet with your photo data
- Basic knowledge of environment variables

## Step 1: Create Your Google Sheets Spreadsheet

1. Open [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or use an existing one
3. Set up your columns according to the required structure (Row 1 should be headers):

| Column | Header            | Description                               | Example                               |
| ------ | ----------------- | ----------------------------------------- | ------------------------------------- |
| A      | source            | Source or origin of the photo             | "Instagram", "Website", "Camera Roll" |
| C      | id                | Unique identifier for each photo          | "photo_1", "IMG_001", "sunset_beach"  |
| G      | page_link         | Link to the page where photo is displayed | "https://example.com/photos/123"      |
| H      | image_link        | Direct link to the photo image            | "https://example.com/photo.jpg"       |
| O      | tags              | Comma-separated tags                      | "nature, sunset, beach"               |
| P      | photographer_name | Photographer's name                       | "John Smith"                          |
| U      | orientation       | Photo orientation                         | "landscape", "portrait", "square"     |
| V      | approve           | Approval status                           | "TRUE" or "FALSE"                     |

**Note**: You can use columns B, D, E, F, I-N, Q-T, W-Z for other data - they will be ignored by the photo dashboard.

## Step 2: Make Your Spreadsheet Public

1. Click the "Share" button in the top right
2. Click "Change to anyone with the link"
3. Select "Viewer" permissions
4. Click "Done"

## Step 3: Get Your Google Sheets API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - Copy the generated API key
   - (Optional) Restrict the API key to Google Sheets API only

## Step 4: Get Your Spreadsheet ID

1. Open your Google Sheets spreadsheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part

## Step 5: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_SHEETS_RANGE=Sheet1!A1:V1000
```

**Important Notes:**

- Replace `your_api_key_here` with your actual Google Sheets API key
- Replace `your_spreadsheet_id_here` with your actual spreadsheet ID
- Adjust the range if your data is in a different sheet or if you need more/fewer rows
- The `.env` file should not be committed to version control

## Step 6: Install Dependencies

Make sure you have the required dependencies installed:

```bash
npm install
```

## Step 7: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the application
3. If configured correctly, you should see your photos loaded from Google Sheets

## Troubleshooting

### Common Issues

1. **"Error Loading Photos"**

   - Check that your API key is correct
   - Verify the spreadsheet ID is correct
   - Ensure the spreadsheet is publicly accessible
   - Check that the Google Sheets API is enabled

2. **"No photos found"**

   - Verify your spreadsheet has data in the required columns
   - Check that the range covers your data
   - Ensure the first row contains headers
   - Make sure columns C (id) and H (image_link) have values

3. **"Failed to update photo approval"**
   - Check API permissions
   - Verify the spreadsheet is not read-only
   - Ensure you have the correct spreadsheet ID

### API Limits

Google Sheets API has usage limits:

- 100 requests per 100 seconds per user
- 500 requests per 100 seconds

If you hit these limits, the app will display appropriate error messages.

## Example Spreadsheet Data

Here's an example of how your spreadsheet data should look:

| A (source) | B   | C (id)  | D   | E   | F   | G (page_link)                | H (image_link)                | I-N | O (tags)      | P (photographer_name) | Q-T | U (orientation) | V (approve) |
| ---------- | --- | ------- | --- | --- | --- | ---------------------------- | ----------------------------- | --- | ------------- | --------------------- | --- | --------------- | ----------- |
| Instagram  |     | photo_1 |     |     |     | https://example.com/photos/1 | https://picsum.photos/800/600 |     | nature,sunset | John Smith            |     | landscape       | TRUE        |
| Website    |     | photo_2 |     |     |     | https://example.com/photos/2 | https://picsum.photos/800/601 |     | city,night    | Jane Doe              |     | portrait        | FALSE       |

**Required columns that must have data:**

- **Column C (id)**: Unique identifier
- **Column H (image_link)**: Direct link to the image

**Optional columns:**

- All other columns can be empty, but if provided, they will enhance the photo information

## Data Mapping

The application maps your Google Sheets data as follows:

- **Column A (source)** → Used as photo description
- **Column C (id)** → Used as both ID and title
- **Column G (page_link)** → Stored as additional metadata
- **Column H (image_link)** → Used as the main photo URL
- **Column O (tags)** → Split by commas into tag array
- **Column P (photographer_name)** → Used as photographer name
- **Column U (orientation)** → Stored as orientation metadata
- **Column V (approve)** → Converted to boolean approval status

## Security Considerations

1. **API Key Security**: Never commit your API key to version control
2. **Spreadsheet Access**: Only make the spreadsheet as public as necessary
3. **Data Validation**: The app includes basic data validation, but ensure your spreadsheet data is clean

## Advanced Configuration

### Custom Sheet Names

If your data is in a sheet other than "Sheet1", update the range in your `.env` file:

```env
VITE_GOOGLE_SHEETS_RANGE=MyPhotos!A1:V1000
```

### Custom Range

If you need to adjust the range for your data:

```env
VITE_GOOGLE_SHEETS_RANGE=Sheet1!A1:V500
```

## Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify all configuration steps
3. Test your API key and spreadsheet ID manually using the Google Sheets API Explorer
4. Ensure your required columns (C and H) have data

---

**Note**: This integration uses the Google Sheets API v4 and requires an active internet connection to function.
