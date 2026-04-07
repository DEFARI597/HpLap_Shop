import { ProductModels } from "./product.model";

export interface OrdersModels {
    order_id: number;
    order_reference: string;
    quantity: number;
    total_price: number;
    status: string;
    product: ProductModels;
    product_id: number;
    created_at: Date;
    updated_at: Date
}