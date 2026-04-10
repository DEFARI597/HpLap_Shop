import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { OrdersItemEntity } from "./orders-items.entities";
import { User } from "../entities/users.entities"; // Import entity User

export enum OrdersStatus {
  PENDING = "pending",
  PAID = "paid",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELED = "canceled",
  REFUNDED = "refunded",
}

@Entity("orders")
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  order_id!: number;

  @Column()
  order_reference!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  user_id!: number;

  @Column({ type: "varchar", length: 255 })
  shipping_name!: string;

  @Column({ type: "varchar", length: 150 })
  shipping_email!: string;

  @Column({ type: "text" })
  shipping_address!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total_price!: number;

  @Column({
    type: "enum",
    enum: OrdersStatus,
    default: OrdersStatus.PENDING,
  })
  status!: OrdersStatus;

  @OneToMany(() => OrdersItemEntity, (item) => item.order, { cascade: true })
  items!: OrdersItemEntity[];

  @CreateDateColumn()
  created_at!: Date;
}