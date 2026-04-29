// Represents a manga/comic page inside a chapter
export type PageItem = {
    id: number; 
    title?: string | null;
    imageUrl: string;
    pageNumber: number;
    content?: string | null;
    chapterId: number;
  };
  
  // Represents a video attached to a series or chapter
  export type VideoItem = {
    id: number;
    title: string;
    videoUrl: string;
    seriesId?: number | null;
    chapterId?: number | null;
    sortOrder: number;
    createdAt?: string;
  };
  
  // Represents an external support/social link
  export type LinkItem = {
    id: number;
    title: string;
    url: string;
    platform?: string | null;
    chapterId: number;
  };