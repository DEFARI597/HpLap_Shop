import { OrderItemModels } from "./orders-items.model";

export enum OrdersStatus {
  PENDING = "pending",
  PAID = "paid",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELED = "canceled",
  REFUNDED = "refunded",
}

export interface OrdersModels {
  order_id: number;
  order_reference: string;
  user_id: number;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  total_price: number;
  status: OrdersStatus;
  items: OrderItemModels[];
  created_at: string | Date;
}
