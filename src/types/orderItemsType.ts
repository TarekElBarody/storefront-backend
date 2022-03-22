import { ProductRes } from './productType';

export enum OrderItemsStatus {
  PENDING = 1,
  CONFIRMED = 2,
  DELIVERING = 3,
  COMPLETED = 4,
  REFUNDING = 5,
  REFUNDED = 6
}

export type OrderItems = {
  id: number;
  order_id: number;
  product_id: number;
  product_info: ProductRes;
  qty: number;
  price: number;
  total: number;
  status: OrderItemsStatus;
};

export type OrderItemsInsert = {
  id?: number;
  order_id: number;
  product_id: number;
  product_info?: ProductRes | JSON;
  qty: number;
  price?: number;
  total?: number;
  status: OrderItemsStatus;
};

export type OrderItemsUpdate = {
  id: number;
  order_id: number;
  product_id?: number;
  product_info?: ProductRes | JSON;
  qty?: number;
  price?: number;
  total?: number;
  status?: OrderItemsStatus;
};
