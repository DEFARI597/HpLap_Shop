import { apiClient } from "../api-client";
import { OrdersModels, OrdersStatus } from "@/models/orders.model";
import { ApiResponse } from "../api-response";
import { CreateOrderPayload } from "./types/orders-payload.type";

class OrdersService {
  async getAllOrders(): Promise<ApiResponse<OrdersModels[]>> {
    return await apiClient.get<OrdersModels[]>("/orders");
  }

  async getOrderById(id: number): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.get<OrdersModels>(`/orders/${id}`);
  }

  async createOrder(
    payload: CreateOrderPayload,
  ): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.post<OrdersModels>("/orders", payload);
  }

  async updateOrderStatus(
    id: number,
    status: OrdersStatus,
  ): Promise<ApiResponse<OrdersModels>> {
    return await apiClient.patch<OrdersModels>(`/orders/${id}/status`, {
      status,
    });
  }

  async deleteOrder(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(`/orders/${id}`);
  }
}

export const ordersService = new OrdersService();
