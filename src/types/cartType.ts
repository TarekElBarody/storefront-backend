export type ShoppingCart = {
  id?: number;
  user_id: number;
  product_id: number;
  qty: number;
  note: string | null;
};

export type ShoppingCartRes = {
  id: number;
  user_id: number;
  product_id: number;
  qty: number;
  name: string;
  description: string;
  category: string;
  price: number;
  total: number;
  details: JSON | null;
  image: string | null;
  note: string | null;
};

export type ShoppingCartUpdate = {
  id: number;
  user_id: number;
  product_id?: number;
  qty?: number;
  note?: string | null;
};
