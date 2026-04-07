import { apiClient } from '../api-client'; 
import { OrdersModels } from '@/models/orders.model';
import { ApiResponse } from '../api-response';

export const ordersService = {
  /**
   * Mengambil semua daftar pesanan
   * GET /orders
   */
  async getAllOrders(): Promise<ApiResponse<OrdersModels[]>> {
    return await apiClient.get<OrdersModels[]>('/orders');
  },

  /**
   * Mengambil detail pesanan berdasarkan ID
   * GET /orders/:id
   */
  async getOrderById(id: number): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.get<OrdersModels>(`/orders/${id}`);
  },

  /**
   * Membuat pesanan baru
   * POST /orders
   * Payload: { product_id: number, quantity: number }
   */
  async createOrder(payload: { product_id: number; quantity: number }): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.post<OrdersModels>('/orders', payload);
  },

  /**
   * Menghapus pesanan (Jika diperlukan)
   * DELETE /orders/:id
   */
  async deleteOrder(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(`/orders/${id}`);
  },

  /**
   * Update status pesanan
   * PATCH /orders/:id
   */
  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.patch<OrdersModels>(`/orders/${id}`, { status });
  }
};