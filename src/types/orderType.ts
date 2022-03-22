import { OrderItems } from './orderItemsType';
import { ResUser } from './userType';

export enum OrderPayment {
  COD = 1,
  VISA = 2
}

export enum OrderStatus {
  PENDING = 1,
  CONFIRMED = 2,
  DELIVERING = 3,
  COMPLETED = 4,
  REFUNDING = 5,
  REFUNDED = 6
}
export type Order = {
  id?: number;
  user_id: number;
  user_info: ResUser;
  qty_count: number;
  total: number;
  status: OrderStatus;
  confirmed_by: number;
  confirmed_date: Date | null;
  payment_type: OrderPayment;
  note: string | null;
  created: Date;
};

export type OrderInsert = {
  user_id: number;
  payment_type: OrderPayment;
  note?: string | null;
};

export type OrderUpdate = {
  id: number;
  status?: OrderStatus;
  confirmed_by?: number;
  confirmed_date?: Date | null;
  payment_type?: OrderPayment;
  note?: string | null;
};

export type OrderRes = {
  id: number;
  user_id: number;
  user_info: ResUser;
  qty_count: number;
  total: number;
  status: OrderStatus;
  confirmed_by: number;
  confirmed_date: Date | null;
  payment_type: OrderPayment;
  note: string | null;
  items: [OrderItems[]];
  created: Date;
};

export type OrderResUser = {
  id: number;
  user_id: number;
  qty_count: number;
  total: number;
  status: OrderStatus;
  confirmed_by: number;
  confirmed_date: Date | null;
  payment_type: OrderPayment;
  note: string | null;
  items: [OrderItems[]];
  created: Date;
};
