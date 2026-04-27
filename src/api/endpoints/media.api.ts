import { api } from "../client";

// Get all pages for one chapter
export const getPagesByChapter = async (chapterId: number) => {
  const res = await api.get(`/Media/pages/chapter/${chapterId}`);
  return res.data;
};

// Create new page
export const createPage = async (dto: {
  title?: string;
  imageUrl: string;
  pageNumber: number;
  content?: string;
  chapterId: number;
}) => {
  const res = await api.post("/Media/pages", dto);
  return res.data;
};

// Update page
export const updatePage = async (
  id: number,
  dto: {
    title?: string;
    imageUrl: string;
    pageNumber: number;
    content?: string;
    chapterId: number;
  }
) => {
  const res = await api.put(`/Media/pages/${id}`, dto);
  return res.data;
};

// Delete page
export const deletePage = async (id: number) => {
  const res = await api.delete(`/Media/pages/${id}`);
  return res.data;
};

// Get all videos for one series, chapter or episode
export const getVideosBySeries = async (seriesId: number) => {
  const res = await api.get(`/Media/videos/series/${seriesId}`);
  return res.data;
};

// Get all videos for one chapter
export const getVideosByChapter = async (chapterId: number) => {
  const res = await api.get(`/Media/videos/chapter/${chapterId}`);
  return res.data;
};

// Get all videos for one episode
export const getVideosByEpisode = async (episodeId: number) => {
  const res = await api.get(`/Media/videos/episode/${episodeId}`);
  return res.data;
};

// Create new video
export const createVideo = async (dto: {
  title: string;
  videoUrl: string;
  sortOrder: number;
  seriesId?: number | null;
  episodeId?: number | null;
}) => {
  const res = await api.post("/Media/videos", dto);
  return res.data;
};

// Update video
export const updateVideo = async (
  id: number,
  dto: {
    title: string;
    videoUrl: string;
    sortOrder: number;
    seriesId?: number | null;
    episodeId?: number | null;
  }
) => {
  const res = await api.put(`/Media/videos/${id}`, dto);
  return res.data;
};

// Delete video
export const deleteVideo = async (id: number) => {
  const res = await api.delete(`/Media/videos/${id}`);
  return res.data;
};

// Get all links for one series, chapter or episode
export const getLinksByChapter = async (chapterId: number) => {
  const res = await api.get(`/Media/links/chapter/${chapterId}`);
  return res.data;
};

// Create new link
export const createLink = async (dto: {
  title: string;
  url: string;
  platform?: string;
  chapterId: number;
}) => {
  const res = await api.post("/Media/links", dto);
  return res.data;
};

// Update link
export const updateLink = async (
  id: number,
  dto: {
    title: string;
    url: string;
    platform?: string;
    chapterId: number;
  }
) => {
  const res = await api.put(`/Media/links/${id}`, dto);
  return res.data;
};

// Delete link
export const deleteLink = async (id: number) => {
  const res = await api.delete(`/Media/links/${id}`);
  return res.data;
};