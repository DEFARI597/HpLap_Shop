import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdersEntity } from "./orders.entities";
import { ProductEntity } from "./products.entities";

@Entity("orders_items")
export class OrdersItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => OrdersEntity, (order) => order.items)
  order!: OrdersEntity;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price_at_purchase!: number; // Harga saat dibeli (penting untuk histori!)
}