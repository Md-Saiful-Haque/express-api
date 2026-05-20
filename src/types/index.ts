export const role = ["user", "admin", "super_admin"] as const;

export type Role = (typeof role)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: Role;
  created_at: Date;
  updated_at: Date;
};

export type RUser = Omit<User, "id" | "created_at" | "updated_at" | "password">;

export type Order = {
  id: number;
  customer_id: number;
  quantity: number;
  food: string;
  price: number;
  created_at: Date;
  updated_at: Date;
};

export type NewOrder = Omit<Order, "id" | "created_at" | "updated_at">;