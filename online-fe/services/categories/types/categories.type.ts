import { CategoriesEntity } from "@/models/categories.model";

export interface CreateCategoryDto {
    category_name: string;
    parent_category_id?: number | null;
    category_image: string;
    is_active?: boolean;
}

export interface UpdateCategoryDto {
    category_name?: string;
    parent_category_id?: number | null;
    category_image?: string;
    is_active?: boolean;
}

export interface CategoryResponse<T = CategoriesEntity | CategoriesEntity[]> {
    data: T;
    message?: string;
    statusCode?: number;
}

export interface BulkUpdateDto {
    ids: number[];
    isActive: boolean;
}

// For breadcrumb navigation
export interface CategoryPath {
    category_id: number;
    category_name: string;
    level: number;
}

// Optional: For filtering/searching
export interface CategoryFilters {
    is_active?: boolean;
    parent_category_id?: number | null;
    search?: string;
}