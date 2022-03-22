import { OrderResUser } from './orderType';
import { ProductRes } from './productType';
import { ShoppingCartRes } from './cartType';

export enum UserRoles {
  Admin = 1,
  Moderator = 2,
  User = 3
}

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  password: string;
  mobile: string | null;
  role: UserRoles;
  created: Date | null;
};

export type ResUser = {
  id: number;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  mobile: string | null;
  role: UserRoles;
  created: Date;
};

export type UserAll = {
  id: number;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  mobile: string | null;
  role: UserRoles;
  created: Date;
  order_count: number;
  order_sum: number;
  most_products: [ProductRes[]] | [];
  last_orders: [OrderResUser[]] | [];
};

export type UserPendingCart = {
  id: number;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  mobile: string | null;
  role: UserRoles;
  created: Date;
  cart_items: [ShoppingCartRes[]];
};

export type UserUpdate = {
  id: number;
  first_name?: string;
  last_name?: string;
  birthday?: Date;
  email?: string;
  password?: string;
  mobile?: string;
  role?: UserRoles;
  created?: Date;
};

export type UpdatePass = {
  id?: number;
  currentPassword: string;
  newPassword: string;
  confirmNew: string;
};
