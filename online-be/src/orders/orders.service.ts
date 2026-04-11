import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { OrdersEntity, OrdersStatus } from "../entities/orders.entities";
import { ProductEntity } from "../entities/products.entities";
import { OrdersItemEntity } from "../entities/orders-items.entities";
import { User } from "../entities/users.entities";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: {
    user_id: number;
    shipping_name: string;
    shipping_email: string;
    shipping_address: string;
    payment_method: string;
    items: { product_id: number; quantity: number }[];
  }) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: createOrderDto.user_id },
      });
      if (!user) {
        throw new NotFoundException(
          `User dengan ID ${createOrderDto.user_id} tidak ditemukan`,
        );
      }

      let grandTotal = 0;
      const orderItems: OrdersItemEntity[] = [];

      for (const item of createOrderDto.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { product_id: item.product_id, is_active: true },
          lock: { mode: "pessimistic_write" },
        });

        if (!product) {
          throw new NotFoundException(
            `Produk dengan ID ${item.product_id} tidak ditemukan atau tidak aktif`,
          );
        }

        if (product.stock_quantity < item.quantity) {
          throw new BadRequestException(
            `Stok produk ${product.product_name} tidak mencukupi. Tersisa: ${product.stock_quantity}`,
          );
        }

        product.stock_quantity -= item.quantity;
        await manager.save(product);

        const subTotal = Number(product.price) * item.quantity;
        grandTotal += subTotal;

        const orderItem = manager.create(OrdersItemEntity, {
          product: product,
          quantity: item.quantity,
          price_at_purchase: product.price,
        });

        orderItems.push(orderItem);
      }

      const orderRef = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newOrder = manager.create(OrdersEntity, {
        order_reference: orderRef,
        user: user,
        user_id: user.id,
        shipping_name: createOrderDto.shipping_name,
        shipping_email: createOrderDto.shipping_email,
        shipping_address: createOrderDto.shipping_address,
        payment_method: createOrderDto.payment_method,
        total_price: grandTotal,
        status: OrdersStatus.PENDING,
        items: orderItems,
      });

      return await manager.save(newOrder);
    });
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ["items", "items.product", "user"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ["items", "items.product", "user"], 
    });

    if (!order) throw new NotFoundException("Pesanan tidak ditemukan");
    return order;
  }

  async updateStatus(id: number, status: OrdersStatus) {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  async handlePaymentSuccess(orderId: number, paymentChannel: string) {
    console.log(`[OrdersService] Mencoba update order ID: ${orderId}`);

    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });
    if (!order) {
      console.error(`[OrdersService] ❌ Order ID ${orderId} tidak ditemukan!`);
      return null;
    }
    order.status = OrdersStatus.PAID; 
    if (paymentChannel) {
      order.payment_method = paymentChannel;
    }
    const savedOrder = await this.orderRepository.save(order);
    console.log(`[OrdersService] ✅ Order ${orderId} BERHASIL diupdate ke database!`);
    
    return savedOrder;
  }
}
