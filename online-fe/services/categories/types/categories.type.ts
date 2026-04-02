export interface CreateCategoryDto {
    category_name: string;
    category_image?: string;
    is_active?: boolean;
}

export interface UpdateCategoryDto {
    category_name?: string;
    category_image?: string;
    is_active?: boolean;
}

export interface CategoryStats {
    total: number;
    active: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    active?: boolean;
}

export interface SearchParams {
    name: string;
    active?: boolean;
}