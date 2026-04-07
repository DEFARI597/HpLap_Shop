import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersEntity } from '../entities/orders.entities';
import { ProductEntity } from '../entities/products.entities';
import { OrdersItemEntity } from '../entities/orders-items.entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
    
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    
    // Repository ini sebenarnya opsional jika Anda menggunakan 'cascade: true'
    @InjectRepository(OrdersItemEntity)
    private readonly ordersItemRepository: Repository<OrdersItemEntity>
  ) {}

  async create(createOrderDto: { product_id: number; quantity: number }) {
    // 1. Cari produk untuk ambil harga dan validasi stok
    const product = await this.productRepository.findOne({
      where: { product_id: createOrderDto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan!');
    }

    // 2. Kalkulasi harga & buat referensi
    const totalPrice = Number(product.price) * createOrderDto.quantity;
    const orderRef = `ORD-${Date.now()}`;

    // 3. Buat Object Order beserta Items-nya (mengandalkan Cascade)
    const newOrder = this.orderRepository.create({
      order_reference: orderRef,
      total_price: totalPrice,
      status: 'pending',
      items: [
        {
          product: product, // Menghubungkan ke ProductEntity
          quantity: createOrderDto.quantity,
          price_at_purchase: product.price, // Snapshot harga saat ini
        }
      ]
    });

    // 4. Save (Akan otomatis menyimpan ke tabel 'orders' DAN 'orders_item')
    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    // Perbaikan: Ambil relasi 'items' dan 'product' di dalamnya
    return await this.orderRepository.find({ 
      relations: ['items', 'items.product'] 
    });
  }

  async findOne(id: number) {
    // Perbaikan: Ambil relasi 'items' dan 'product' di dalamnya
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['items', 'items.product'],
    });
    
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');
    return order;
  }
}