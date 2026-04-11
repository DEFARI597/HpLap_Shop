export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  customerEmail: string;
  paymentMethods?: string[];
}

export interface XenditInvoiceResponse {
  invoiceUrl: string;
  external_id: string;
  status: string;
}
