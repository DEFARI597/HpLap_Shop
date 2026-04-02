import { ProductType } from "@/models/product.model";


export interface CreateProductDto {
    product_name: string;
    description?: string;
    price: number;
    stock_quantity?: number;
    product_type: ProductType;
    product_main_image?: string;
    product_additional_images?: string[];
    category_id?: number;
    brand?: string;
    is_active?: boolean;
    is_featured?: boolean;
}

export interface UpdateProductDto {
    product_name?: string;
    description?: string;
    price?: number;
    stock_quantity?: number;
    product_type?: ProductType;
    product_main_image?: string;
    product_additional_images?: string[];
    category_id?: number;
    brand?: string;
    is_active?: boolean;
    is_featured?: boolean;
}

export interface ProductFilter {
    category_id?: number;
    product_type?: ProductType;
    is_active?: boolean;
    is_featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ProductStats {
    category_id: number;
    product_count: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
}