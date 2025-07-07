import { Photo } from "../../types";
import {
  GOOGLE_SHEETS_CONFIG,
  validateGoogleSheetsConfig,
  SHEET_COLUMNS,
  COLUMN_INDEXES,
} from "../config/googleSheets";

export class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;
  private range: string;
  private baseUrl: string;

  constructor() {
    if (!validateGoogleSheetsConfig()) {
      throw new Error("Google Sheets configuration is invalid");
    }

    this.apiKey = GOOGLE_SHEETS_CONFIG.apiKey;
    this.spreadsheetId = GOOGLE_SHEETS_CONFIG.spreadsheetId;
    this.range = GOOGLE_SHEETS_CONFIG.range;
    this.baseUrl = "https://sheets.googleapis.com/v4/spreadsheets";
  }

  /**
   * Fetch all photos from Google Sheets
   */
  async fetchPhotos(): Promise<Photo[]> {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.values || data.values.length === 0) {
        return [];
      }

      // Skip header row if it exists
      const rows = data.values.slice(1);

      return rows
        .map((row: string[]) => this.mapRowToPhoto(row))
        .filter(Boolean);
    } catch (error) {
      console.error("Error fetching photos from Google Sheets:", error);
      throw error;
    }
  }

  /**
   * Update a photo's approval status in Google Sheets
   */
  async updatePhotoApproval(photoId: string, approved: boolean): Promise<void> {
    try {
      // First, find the row number for this photo
      const photos = await this.fetchPhotos();
      const photoIndex = photos.findIndex((photo) => photo.id === photoId);

      if (photoIndex === -1) {
        throw new Error(`Photo with ID ${photoId} not found`);
      }

      // Row number is index + 2 (1 for 0-based to 1-based, 1 for header row)
      const rowNumber = photoIndex + 2;
      const range = `${SHEET_COLUMNS.APPROVE}${rowNumber}`;

      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[approved ? "TRUE" : "FALSE"]],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating photo approval:", error);
      throw error;
    }
  }

  /**
   * Add a new photo to Google Sheets
   */
  async addPhoto(photo: Omit<Photo, "id">): Promise<Photo> {
    try {
      const newId = `photo_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      const newPhoto: Photo = { ...photo, id: newId };

      const rowData = this.mapPhotoToRow(newPhoto);
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${this.range}:append?valueInputOption=RAW&key=${this.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return newPhoto;
    } catch (error) {
      console.error("Error adding photo to Google Sheets:", error);
      throw error;
    }
  }

  /**
   * Convert a spreadsheet row to a Photo object
   */
  private mapRowToPhoto(row: string[]): Photo | null {
    try {
      // Extract values using column indexes
      const source = row[COLUMN_INDEXES.SOURCE] || "";
      const id = row[COLUMN_INDEXES.ID] || "";
      const pageLink = row[COLUMN_INDEXES.PAGE_LINK] || "";
      const imageLink = row[COLUMN_INDEXES.IMAGE_LINK] || "";
      const tags = row[COLUMN_INDEXES.TAGS] || "";
      const photographerName = row[COLUMN_INDEXES.PHOTOGRAPHER_NAME] || "";
      const orientation = row[COLUMN_INDEXES.ORIENTATION] || "";
      const approve = row[COLUMN_INDEXES.APPROVE] || "";

      // Skip rows with missing essential data
      if (!id || !imageLink) {
        return null;
      }

      // Generate a title from the id or use a default
      const title = id || "Untitled Photo";

      return {
        id,
        url: imageLink,
        title,
        description: source,
        photographer: photographerName,
        uploadDate: new Date().toISOString(), // Current date since we don't have upload date
        approved: approve.toLowerCase() === "true",
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        source,
        pageLink,
        orientation,
        metadata: {
          camera: "",
          lens: "",
          aperture: "",
          shutterSpeed: "",
          iso: 0,
        },
      };
    } catch (error) {
      console.error("Error mapping row to photo:", error);
      return null;
    }
  }

  /**
   * Convert a Photo object to a spreadsheet row
   * Creates a sparse array with values in the correct column positions
   */
  private mapPhotoToRow(photo: Photo): string[] {
    // Create an array with enough elements to reach the highest column index
    const maxIndex = Math.max(
      COLUMN_INDEXES.SOURCE,
      COLUMN_INDEXES.ID,
      COLUMN_INDEXES.PAGE_LINK,
      COLUMN_INDEXES.IMAGE_LINK,
      COLUMN_INDEXES.TAGS,
      COLUMN_INDEXES.PHOTOGRAPHER_NAME,
      COLUMN_INDEXES.ORIENTATION,
      COLUMN_INDEXES.APPROVE
    );
    const row = new Array(maxIndex + 1).fill("");

    // Set values in the correct positions
    row[COLUMN_INDEXES.SOURCE] = photo.source || photo.description || "";
    row[COLUMN_INDEXES.ID] = photo.id;
    row[COLUMN_INDEXES.PAGE_LINK] = photo.pageLink || "";
    row[COLUMN_INDEXES.IMAGE_LINK] = photo.url;
    row[COLUMN_INDEXES.TAGS] = photo.tags.join(", ");
    row[COLUMN_INDEXES.PHOTOGRAPHER_NAME] = photo.photographer;
    row[COLUMN_INDEXES.ORIENTATION] = photo.orientation || "";
    row[COLUMN_INDEXES.APPROVE] = photo.approved ? "TRUE" : "FALSE";

    return row;
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService();
