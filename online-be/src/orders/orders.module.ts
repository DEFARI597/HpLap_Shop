import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersEntity } from '../entities/orders.entities';
import { ProductEntity } from '../entities/products.entities';
import { OrdersItemEntity } from '../entities/orders-items.entities';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, ProductEntity, OrdersItemEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
