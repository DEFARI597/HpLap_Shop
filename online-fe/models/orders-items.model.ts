import { ProductModels } from "./product.model";

export interface OrderItemModels {
  id: number;
  product: ProductModels;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}
