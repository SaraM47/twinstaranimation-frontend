import { api } from "../client";

// Create or update series rating
export const rateSeries = async (seriesId: number, value: number) => {
  const res = await api.post("/Ratings/rate", {
    seriesId,
    value,
  });
  return res.data;
};

// Get current user's rating for one series
export const getMyRating = async (seriesId: number) => {
  const res = await api.get(`/Ratings/${seriesId}/me`);
  return res.data;
};