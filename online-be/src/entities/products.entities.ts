import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { CategoriesEntity } from "./categories.entities";

export enum ProductType {
  WINDOWS = "windows",
  ANDROID = "android",
  IOS = "ios",
  MAC = "mac",
}

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column({ type: "varchar", length: 200 })
  product_name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int", default: 0 })
  stock_quantity!: number;

  @Column({
    type: "enum",
    enum: ProductType,
    name: "product_type",
  })
  @Index("idx_product_type")
  product_type!: ProductType;

  @Column({ type: "varchar", length: 1000, nullable: true })
  product_main_image!: string;

  @Column({ type: "simple-array", nullable: true })
  product_additional_image!: string[];

  @Column({ name: "category_id", nullable: true })
  @Index("idx_product_category")
  category_id!: number;

  @ManyToOne(() => CategoriesEntity, (category) => category.products, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "category_id" })
  category!: CategoriesEntity;

  @Column({ type: "varchar", length: 100, nullable: true })
  brand!: string;

  @Column({
    type: "boolean",
    default: true,
    name: "is_active",
  })
  @Index("idx_product_active")
  is_active!: boolean;

  @Column({
    type: "boolean",
    default: false,
    name: "is_featured",
  })
  @Index("idx_product_featured")
  is_featured?: boolean;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  rating?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at!: Date;
}
