import { api } from "../client";
import type { CreateSeriesDto, UpdateSeriesDto } from "../../features/series/types";

// Get all series
export const getSeries = async () => {
  const res = await api.get("/Series");
  return res.data;
};

// Get series by id
export const getSeriesById = async (id: number) => {
  const res = await api.get(`/Series/${id}`);
  return res.data;
};

// Create new series
export const createSeries = async (dto: CreateSeriesDto) => {
  const res = await api.post("/Series", dto);
  return res.data;
};

// Update existing series
export const updateSeries = async (id: number, dto: UpdateSeriesDto) => {
  const res = await api.put(`/Series/${id}`, dto);
  return res.data;
};

// Delete series by id
export const deleteSeries = async (id: number) => {
  const res = await api.delete(`/Series/${id}`);
  return res.data;
};