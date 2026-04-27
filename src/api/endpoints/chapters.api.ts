import { api } from "../client";

// Get all chapters for one series
export const getChaptersBySeries = async (seriesId: number) => {
  const res = await api.get(`/Chapters/series/${seriesId}`);
  return res.data;
};

// Create new chapter
export const createChapter = async (dto: {
  title: string;
  sortOrder: number;
  seriesId: number;
}) => {
  const res = await api.post("/Chapters", dto);
  return res.data;
};

// Update chapter
export const updateChapter = async (
  id: number,
  dto: { title: string; sortOrder: number }
) => {
  const res = await api.put(`/Chapters/${id}`, dto);
  return res.data;
};

// Delete chapter
export const deleteChapter = async (id: number) => {
  const res = await api.delete(`/Chapters/${id}`);
  return res.data;
};