import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Xendit } from "xendit-node"; // Pastikan import seperti ini
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { XenditWebhookDto } from "./xendit/xendit-webhook.dto";
import { OrdersStatus } from "../entities/orders.entities";

@Injectable()
export class PaymentService {
  private xendit: Xendit;
    ordersService: any;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>("xendit.secretKey");

    if (!secretKey) {
      throw new Error("XENDIT_SECRET_KEY is missing in .env");
    }

    // Inisialisasi utama
    this.xendit = new Xendit({ secretKey });
  }

  async createInvoice(createPaymentDto: CreatePaymentDto) {
    const frontendUrl = this.configService.get<string>("xendit.frontendUrl");
    const orderId = createPaymentDto.orderId;
    const dynamicSuccessUrl = `${frontendUrl}/${orderId}/payment`;

    try {
      const response = await this.xendit.Invoice.createInvoice({
        data: {
          externalId: orderId,
          amount: createPaymentDto.amount,
          payerEmail: createPaymentDto.customerEmail,
          description: `Order #${orderId} - HpLap Shop`,
          currency: "IDR",
          successRedirectUrl: dynamicSuccessUrl,
          failureRedirectUrl: `${frontendUrl}/payment/failed`,
          paymentMethods: createPaymentDto.paymentMethods,
        },
      });
      return response;
    } catch (error) {
      console.error("Xendit Error:", error);
      throw new InternalServerErrorException("Gagal membuat invoice di Xendit");
    }
  }

async handleWebhook(payload: XenditWebhookDto) {
  const xenditStatus = payload.status.toLowerCase(); 
  if (xenditStatus === 'paid' || xenditStatus === 'settled') {
    const orderId = Number(payload.external_id);
    await this.ordersService.updateStatus(orderId, OrdersStatus.PAID);
  }
}
}
