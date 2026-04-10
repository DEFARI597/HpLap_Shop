export interface CreateOrderPayload {
  user_id: number;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
