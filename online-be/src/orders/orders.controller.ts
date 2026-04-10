import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersStatus } from "../entities/orders.entities";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body()
    createOrderDto: {
      user_id: number;
      shipping_name: string;
      shipping_email: string;
      shipping_address: string;
      items: { product_id: number; quantity: number }[];
    },
  ) {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.ordersService.findOne(id);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: OrdersStatus,
  ) {
    return await this.ordersService.updateStatus(id, status);
  }
}
