import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilter,
  PaginatedResponse,
  ProductStats,
  ApiError,
} from "./types/product.type";
import { ProductModels, ProductType } from "@/models/product.model";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/products`;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  private buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    return queryParams.toString();
  }

  async createProduct(data: CreateProductDto): Promise<ProductModels> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async getProducts(
    filter?: ProductFilter,
  ): Promise<PaginatedResponse<ProductModels>> {
    try {
      const queryString = filter ? this.buildQueryString(filter) : "";
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 60 },
      });

      return this.handleResponse<PaginatedResponse<ProductModels>>(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getFeaturedProducts(limit: number = 10): Promise<ProductModels[]> {
    try {
      const response = await fetch(`${this.baseUrl}/featured?limit=${limit}`, {
        method: "GET",
        headers: this.getHeaders(),
        next: { revalidate: 60 },
      });

      return this.handleResponse<ProductModels[]>(response);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  }

  async getProductsByType(type: ProductType): Promise<ProductModels[]> {
    try {
      const response = await fetch(`${this.baseUrl}/type/${type}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleResponse<ProductModels[]>(response);
    } catch (error) {
      console.error(`Error fetching products by type ${type}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: number): Promise<ProductModels[]> {
    try {
      const response = await fetch(`${this.baseUrl}/category/${categoryId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      return this.handleResponse<ProductModels[]>(response);
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error,
      );
      throw error;
    }
  }

  async getProductCountByCategory(categoryId: number): Promise<ProductStats> {
    try {
      const response = await fetch(
        `${this.baseUrl}/category/${categoryId}/count`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      return this.handleResponse<ProductStats>(response);
    } catch (error) {
      console.error(
        `Error fetching product count for category ${categoryId}:`,
        error,
      );
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductModels> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store", // SSR: always fetch fresh data
      });
      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    data: UpdateProductDto,
  ): Promise<ProductModels> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async updateProductStock(
    id: number,
    quantity: number,
  ): Promise<ProductModels> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/stock`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify({ quantity }),
      });

      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  }

  async updateProductRating(
    id: number,
    rating: number,
  ): Promise<ProductModels> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/rating`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify({ rating }),
      });

      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error(`Error updating rating for product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  async softDeleteProduct(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/soft`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error soft deleting product ${id}:`, error);
      throw error;
    }
  }

  async restoreProduct(id: number): Promise<ProductModels> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/restore`, {
        method: "PATCH",
        headers: this.getHeaders(),
      });

      return this.handleResponse<ProductModels>(response);
    } catch (error) {
      console.error(`Error restoring product ${id}:`, error);
      throw error;
    }
  }
}

export const productService = new ProductService();
