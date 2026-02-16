import { CategoriesEntity } from "@/models/categories.model";
import { CreateCategoryDto, UpdateCategoryDto, BulkUpdateDto, CategoryPath } from './types/categories.type';
import { apiClient } from '../api-client';

class CategoryService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = '/categories'; 
    }

    // GET /categories - Get all categories
    async getAllCategories(hierarchy: boolean = false): Promise<CategoriesEntity[]> {
        try {
            const response = await apiClient.get<CategoriesEntity[]>(
                this.baseUrl,
                hierarchy ? { hierarchy: 'true' } : undefined
            );

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // GET /categories/active - Get active categories
    async getActiveCategories(): Promise<CategoriesEntity[]> {
        try {
            const response = await apiClient.get<CategoriesEntity[]>(`${this.baseUrl}/active`);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data || [];
        } catch (error) {
            console.error('Error fetching active categories:', error);
            throw error;
        }
    }

    // GET /categories/:id - Get single category
    async getCategoryById(id: number): Promise<CategoriesEntity> {
        try {
            const response = await apiClient.get<CategoriesEntity>(`${this.baseUrl}/${id}`);

            if (!response.success) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('Category not found');
            }

            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    }

    // GET /categories/:id/subcategories - Get subcategories
    async getSubcategories(id: number): Promise<CategoriesEntity[]> {
        try {
            const response = await apiClient.get<CategoriesEntity[]>(`${this.baseUrl}/${id}/subcategories`);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data || [];
        } catch (error) {
            console.error(`Error fetching subcategories for ${id}:`, error);
            throw error;
        }
    }

    // GET /categories/:id/path - Get path to root (breadcrumb)
    async getCategoryPath(id: number): Promise<CategoriesEntity[]> {
        try {
            const response = await apiClient.get<CategoriesEntity[]>(`${this.baseUrl}/${id}/path`);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data || [];
        } catch (error) {
            console.error(`Error fetching path for category ${id}:`, error);
            throw error;
        }
    }

    // POST /categories - Create new category
    async createCategory(data: CreateCategoryDto): Promise<CategoriesEntity> {
        try {
            const response = await apiClient.post<CategoriesEntity>(this.baseUrl, data);

            if (!response.success) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('Failed to create category');
            }

            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    // PATCH /categories/:id - Update category
    async updateCategory(id: number, data: UpdateCategoryDto): Promise<CategoriesEntity> {
        try {
            const response = await apiClient.patch<CategoriesEntity>(`${this.baseUrl}/${id}`, data);

            if (!response.success) {
                throw new Error(response.error);
            }

            if (!response.data) {
                throw new Error('Failed to update category');
            }

            return response.data;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    }

    // DELETE /categories/:id - Delete category
    async deleteCategory(id: number): Promise<void> {
        try {
            const response = await apiClient.delete<{ message?: string }>(`${this.baseUrl}/${id}`);

            if (!response.success) {
                throw new Error(response.error);
            }

            // 204 No Content response is handled by apiClient
            return;
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    }

    // PATCH /categories/bulk/status - Bulk update status
    async bulkUpdateStatus(data: BulkUpdateDto): Promise<void> {
        try {
            const response = await apiClient.patch<{ message?: string }>(`${this.baseUrl}/bulk/status`, data);

            if (!response.success) {
                throw new Error(response.error);
            }

            return;
        } catch (error) {
            console.error('Error bulk updating status:', error);
            throw error;
        }
    }

    // Helper method to build category tree
    buildCategoryTree(categories: CategoriesEntity[], parentId: number | null = null): CategoriesEntity[] {
        const tree: CategoriesEntity[] = [];

        for (const category of categories) {
            if (category.parent_category_id === parentId) {
                const children = this.buildCategoryTree(categories, category.category_id);
                if (children.length) {
                    category.children = children;
                }
                tree.push(category);
            }
        }

        return tree;
    }

    // Helper method to get all subcategory IDs recursively
    async getAllSubcategoryIds(categoryId: number): Promise<number[]> {
        try {
            const subcategories = await this.getSubcategories(categoryId);
            let ids: number[] = subcategories.map(sub => sub.category_id);

            for (const sub of subcategories) {
                const childIds = await this.getAllSubcategoryIds(sub.category_id);
                ids = [...ids, ...childIds];
            }

            return ids;
        } catch (error) {
            console.error(`Error getting subcategory IDs for ${categoryId}:`, error);
            throw error;
        }
    }

    // Helper method to generate breadcrumb
    async getBreadcrumb(categoryId: number): Promise<CategoryPath[]> {
        try {
            const path = await this.getCategoryPath(categoryId);
            return path.map((cat, index) => ({
                category_id: cat.category_id,
                category_name: cat.category_name,
                level: index
            }));
        } catch (error) {
            console.error(`Error generating breadcrumb for ${categoryId}:`, error);
            throw error;
        }
    }

    // Additional helper: Get category tree directly from API
    async getCategoryTree(): Promise<CategoriesEntity[]> {
        try {
            const categories = await this.getAllCategories(true);
            return categories;
        } catch (error) {
            console.error('Error fetching category tree:', error);
            throw error;
        }
    }

    // Additional helper: Toggle category status
    async toggleCategoryStatus(id: number, currentStatus: boolean): Promise<CategoriesEntity> {
        return this.updateCategory(id, { is_active: !currentStatus });
    }

    // Additional helper: Move category to another parent
    async moveCategory(categoryId: number, newParentId: number | null): Promise<CategoriesEntity> {
        return this.updateCategory(categoryId, { parent_category_id: newParentId });
    }
}

// Export singleton instance
export const categoryService = new CategoryService();