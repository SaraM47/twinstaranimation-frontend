// Main series model returned from backend
export type Series = {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  productId?: number | null;
  creatorId?: string | null;
  createdAt?: string;
  isPublished?: boolean;
};

// DTO used when creating a new series
export type CreateSeriesDto = {
  title: string;
  description: string;
  coverImageUrl: string;
  productId?: number | null;
  authors?: string | null;
  status?: string | null;
  genres?: string | null;
};

// DTO used when updating an existing series
export type UpdateSeriesDto = {
  title: string;
  description: string;
  coverImageUrl: string;
  authors?: string | null;
  status?: string | null;
  genres?: string | null;
};

// Represents a chapter within a series
export type Chapter = {
  id: number;
  title: string;
  sortOrder: number;
  seriesId: number;
  createdAt?: string;
};