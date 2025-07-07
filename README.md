# Photo Dashboard with Google Sheets Integration

A modern, responsive photo management dashboard that integrates with Google Sheets as a database. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Google Sheets Integration**: Use your existing Google Sheets as a photo database
- **Multiple View Modes**: Grid, List, and Card views for different browsing experiences
- **Real-time Updates**: Changes sync directly to your Google Sheets
- **Advanced Filtering**: Filter by approval status, search by title, photographer, or tags
- **Bulk Operations**: Approve or reject multiple photos at once
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 📁 Project Structure

```
photo-dashboard/
├── src/
│   ├── config/
│   │   └── googleSheets.ts      # Google Sheets API configuration
│   └── services/
│       └── googleSheetsService.ts # Google Sheets API service
├── components/                   # React components
│   ├── Header.tsx
│   ├── PhotoGrid.tsx
│   ├── PhotoList.tsx
│   ├── PhotoCardView.tsx
│   └── PhotoDetailsPanel.tsx
├── hooks/                       # Custom React hooks
├── data/                        # Mock data (fallback)
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose configuration
└── GOOGLE_SHEETS_SETUP.md       # Detailed setup instructions
```

## 🔧 Google Sheets Column Structure

Your Google Sheets should have the following columns:

| Column | Header            | Description                                   | Required     |
| ------ | ----------------- | --------------------------------------------- | ------------ |
| A      | source            | Source or origin of the photo                 | Optional     |
| C      | id                | Unique identifier for each photo              | **Required** |
| G      | page_link         | Link to the page where photo is displayed     | Optional     |
| H      | image_link        | Direct link to the photo image                | **Required** |
| O      | tags              | Comma-separated tags                          | Optional     |
| P      | photographer_name | Photographer's name                           | Optional     |
| U      | orientation       | Photo orientation (landscape/portrait/square) | Optional     |
| V      | approve           | Approval status (TRUE/FALSE)                  | Optional     |

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/trostle/photo-dashboard-sheets.git
   cd photo-dashboard-sheets/google_ai_studio_v1
   ```

2. **Set up environment variables:**

   ```bash
   # Create .env file with your Google Sheets credentials
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run with Docker:**

   ```bash
   docker-compose up
   ```

4. **Access the dashboard:**
   Open http://localhost:5173 in your browser

### Option 2: Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # Create .env file
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
   VITE_GOOGLE_SHEETS_RANGE=Sheet1!A1:V1000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔑 Google Sheets Setup

For detailed instructions on setting up Google Sheets integration, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).

**Quick Setup:**

1. Create a Google Sheets spreadsheet with the required columns
2. Get a Google Sheets API key from Google Cloud Console
3. Make your spreadsheet publicly readable
4. Configure environment variables

## 🐳 Docker Deployment

### Development

```bash
docker-compose up
```

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🌐 Environment Variables

| Variable                            | Description                        | Required |
| ----------------------------------- | ---------------------------------- | -------- |
| `VITE_GOOGLE_SHEETS_API_KEY`        | Google Sheets API key              | Yes      |
| `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` | Your spreadsheet ID                | Yes      |
| `VITE_GOOGLE_SHEETS_RANGE`          | Data range (e.g., Sheet1!A1:V1000) | Yes      |

## 📱 Usage

### Viewing Photos

- Use the **Grid View** for a compact photo gallery
- Use the **List View** for detailed information in tabular format
- Use the **Card View** for a Pinterest-style layout

### Managing Approvals

- Click the approval button on individual photos
- Use bulk selection to approve/reject multiple photos
- Filter by approval status to focus on pending items

### Searching and Filtering

- Search by photo title, photographer name, or tags
- Filter by approval status (All, Approved, Pending)
- Sort by date, photographer, or title

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Adding New Features

1. **Components**: Add new UI components in `components/`
2. **Services**: Extend Google Sheets functionality in `src/services/`
3. **Types**: Update TypeScript interfaces in `types.ts`

## 🔧 Troubleshooting

### Common Issues

1. **"Error Loading Photos"**

   - Verify your Google Sheets API key is correct
   - Check that the spreadsheet is publicly accessible
   - Ensure the Google Sheets API is enabled in Google Cloud Console

2. **"No photos found"**

   - Check that columns C (id) and H (image_link) have data
   - Verify the range in your environment variables covers your data

3. **Docker issues**
   - Ensure Docker is running
   - Check that port 5173 is available

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For detailed setup instructions, see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).

## 🔗 Links

- **GitHub Repository**: https://github.com/trostle/photo-dashboard-sheets
- **Live Demo**: [Add your deployment URL here]
- **Documentation**: [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
