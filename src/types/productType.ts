export enum ProductStatus {
  Disabled = 0,
  Enabled = 1
}

export type ProductDetail = {
  name: string;
  value: string;
};

export type Product = {
  id?: number;
  name: string;
  description: string;
  category_id: number;
  price: number;
  stock: number;
  details: { items: ProductDetail[] };
  image: string | null;
  status: ProductStatus;
  created: Date | null;
};

export type TopProduct = {
  id?: number;
  name: string;
  description: string;
  category_id: number;
  price: number;
  stock: number;
  details: { items: ProductDetail[] };
  image: string | null;
  status: ProductStatus;
  created: Date | null;
  count: number;
};

export type ProductRes = {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  details: { items: ProductDetail[] };
  image: string | null;
};

export type ProductUpdate = {
  id: number;
  name?: string;
  description?: string;
  category_id?: number;
  price?: number;
  stock?: number;
  details?: { items: ProductDetail[] };
  image?: string;
  status?: ProductStatus;
};
