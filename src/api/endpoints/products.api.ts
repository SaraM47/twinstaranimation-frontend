import { api } from "../client";
import type { CreateProductDto, UpdateProductDto } from "../../features/products/types";

// Get all products
export const getProducts = async () => {
  const res = await api.get("/Products");
  return res.data;
};

// Get product by id
export const getProductById = async (id: number) => {
  const res = await api.get(`/Products/${id}`);
  return res.data;
};

// Create new product
export const createProduct = async (dto: CreateProductDto) => {
  const res = await api.post("/Products", dto);
  return res.data;
};

// Update existing product
export const updateProduct = async (id: number, dto: UpdateProductDto) => {
  const res = await api.put(`/Products/${id}`, dto);
  return res.data;
};

// Delete product by id
export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/Products/${id}`);
  return res.data;
};