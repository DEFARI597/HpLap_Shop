import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  UnauthorizedException, 
  HttpCode, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import { XenditWebhookDto } from './xendit/xendit-webhook.dto';
import { OrdersService } from '../orders/orders.service';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService
  ) {}

  @Post('create-invoice')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log(`Membuat invoice untuk order: ${createPaymentDto.orderId}`);
    return await this.paymentService.createInvoice(createPaymentDto);
  }

  @Post('webhook')
  @HttpCode(200) 
  async handleWebhook(
    @Body() payload: XenditWebhookDto,
    @Headers('x-callback-token') callbackToken: string
  ) {
    const VERIFICATION_TOKEN = this.configService.get<string>('XENDIT_WEBHOOK_VERIFICATION_TOKEN'); 

    if (callbackToken !== VERIFICATION_TOKEN) {
      throw new UnauthorizedException('Invalid callback token');
    }

    console.log(`Menerima Webhook untuk Order: ${payload.external_id} - Status: ${payload.status}`);

    if (payload.status === 'PAID' || payload.status === 'SETTLED') {
  const orderId = Number(payload.external_id);

  if (isNaN(orderId)) {
    console.error(`❌ Webhook Error: external_id "${payload.external_id}" bukan angka yang valid.`);
    return { status: 'ignored', message: 'Invalid ID format' };
  }


    return { status: 'success' };
    }
  }
}