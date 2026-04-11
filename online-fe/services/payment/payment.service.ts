import { CreatePaymentRequest } from "./types/create-payment";
import { apiClient } from "../api-client";
import { XenditInvoiceResponse } from "./types/create-payment";
import { ApiResponse } from "../api-response";


export const paymentService = {
  async createInvoice(data: CreatePaymentRequest): Promise<ApiResponse<XenditInvoiceResponse>> {
    return await apiClient.post<XenditInvoiceResponse>('/payment/create-invoice', data);
  },
};