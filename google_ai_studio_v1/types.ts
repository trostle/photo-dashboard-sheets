export interface Photo {
  id: string;
  url: string; // This will be mapped from image_link
  title: string; // This will be mapped from id or a generated title
  description: string; // This will be mapped from source
  photographer: string; // This will be mapped from photographer_name
  uploadDate: string; // ISO string format for easy sorting - will be generated
  approved: boolean; // This will be mapped from approve
  tags: string[];
  // New fields from your Google Sheets structure
  source?: string;
  pageLink?: string; // This will be mapped from page_link
  orientation?: string;
  // Optional metadata - these will be empty for your structure
  metadata?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
  };
}

export enum ViewMode {
  Grid = "grid",
  List = "list",
  Card = "card",
}

export enum SortOption {
  DateNewest = "date-newest",
  DateOldest = "date-oldest",
  PhotographerAZ = "photographer-az",
  PhotographerZA = "photographer-za",
  TitleAZ = "title-az",
  TitleZA = "title-za",
}

export enum FilterStatus {
  All = "all",
  Approved = "approved",
  Pending = "pending",
}

export type Theme = "light" | "dark";
