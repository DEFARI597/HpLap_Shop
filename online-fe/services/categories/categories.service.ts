// services/category.service.ts
import { CreateCategoryDto, UpdateCategoryDto, CategoryStats, SearchParams } from './types/categories.type';
import { CategoriesModels } from '@/models/categories.model';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class CategoryService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${API_BASE_URL}/categories`;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        // For 204 No Content responses
        if (response.status === 204) {
            return null as T;
        }

        return await response.json();
    }

    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
        };
    }

    // Create a new category
    async createCategory(data: CreateCategoryDto): Promise<CategoriesModels> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });
            return this.handleResponse<CategoriesModels>(response);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    // Get all categories with optional filter
    async getAllCategories(active?: boolean): Promise<CategoriesModels[]> {
        try {
            const url = active !== undefined
                ? `${this.baseUrl}?active=${active}`
                : this.baseUrl;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                next: { revalidate: 60 } // ISR: revalidate every 60 seconds
            });

            return this.handleResponse<CategoriesModels[]>(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // Get only active categories
    async getActiveCategories(): Promise<CategoriesModels[]> {
        try {
            const response = await fetch(`${this.baseUrl}/active`, {
                method: 'GET',
                headers: this.getHeaders(),
                next: { revalidate: 60 }
            });

            return this.handleResponse<CategoriesModels[]>(response);
        } catch (error) {
            console.error('Error fetching active categories:', error);
            throw error;
        }
    }

    // Get single category by ID
    async getCategoryById(id: number): Promise<CategoriesModels> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: this.getHeaders(),
                cache: 'no-store' // SSR: always fetch fresh data
            });

            return this.handleResponse<CategoriesModels>(response);
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    }

    // Search categories by name
    async searchCategories(params: SearchParams): Promise<CategoriesModels[]> {
        try {
            const queryParams = new URLSearchParams({
                name: params.name,
                ...(params.active !== undefined && { active: params.active.toString() })
            });

            const response = await fetch(`${this.baseUrl}/search?${queryParams}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse<CategoriesModels[]>(response);
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error;
        }
    }

    // Get category statistics
    async getCategoryStats(): Promise<CategoryStats> {
        try {
            const response = await fetch(`${this.baseUrl}/stats`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse<CategoryStats>(response);
        } catch (error) {
            console.error('Error fetching category stats:', error);
            throw error;
        }
    }

    // Update category
    async updateCategory(id: number, data: UpdateCategoryDto): Promise<CategoriesModels> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse<CategoriesModels>(response);
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    }

    // Delete category permanently
    async deleteCategory(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            await this.handleResponse<void>(response);
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    }

    // Soft delete category
    async softDeleteCategory(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/soft`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            await this.handleResponse<void>(response);
        } catch (error) {
            console.error(`Error soft deleting category ${id}:`, error);
            throw error;
        }
    }

    // Restore soft-deleted category
    async restoreCategory(id: number): Promise<CategoriesModels> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/restore`, {
                method: 'PATCH',
                headers: this.getHeaders(),
            });

            return this.handleResponse<CategoriesModels>(response);
        } catch (error) {
            console.error(`Error restoring category ${id}:`, error);
            throw error;
        }
    }
}

export const categoryService = new CategoryService();