import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { OrdersItemEntity } from "./orders-items.entities";

@Entity("orders")
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  order_id!: number;

  @Column()
  order_reference!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total_price!: number;

  @Column({ default: "pending" })
  status!: string;

  @OneToMany(() => OrdersItemEntity, (item) => item.order, { cascade: true })
  items!: OrdersItemEntity[];

  @CreateDateColumn()
  created_at!: Date;
}