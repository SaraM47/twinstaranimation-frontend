// Main product model returned from backend
export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    creatorId: string;
    createdAt?: string;
  };
  
  // DTO used when creating a new product
  export type CreateProductDto = {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
  
  // DTO used when updating an existing product
  export type UpdateProductDto = {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
  };