export enum ProductType {
  WINDOWS = "windows",
  ANDROID = "android",
  IOS = "ios",
  MAC = "mac",
}

export interface ProductModels {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  product_type: ProductType;
  product_main_image: string;
  product_additional_images: string[];
  category_id: number;
  category?: {
    category_id: number;
    category_name: string;
  };
  brand: string;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}
