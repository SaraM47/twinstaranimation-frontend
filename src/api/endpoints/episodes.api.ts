import { api } from "../client";

// Get public episodes for one series
export const getEpisodesBySeries = async (seriesId: number) => {
  const res = await api.get(`/Episodes/series/${seriesId}`);
  return res.data;
};

// Get creator episodes for one series
export const getEpisodesBySeriesForCreator = async (seriesId: number) => {
  const res = await api.get(`/Episodes/creator/series/${seriesId}`);
  return res.data;
};

// Create new episode
export const createEpisode = async (dto: {
  title: string;
  sortOrder: number;
  seriesId: number;
}) => {
  const res = await api.post("/Episodes", dto);
  return res.data;
};

// Update episode
export const updateEpisode = async (
  id: number,
  dto: {
    title: string;
    sortOrder: number;
  }
) => {
  const res = await api.put(`/Episodes/${id}`, dto);
  return res.data;
};

// Delete episode
export const deleteEpisode = async (id: number) => {
  const res = await api.delete(`/Episodes/${id}`);
  return res.data;
};