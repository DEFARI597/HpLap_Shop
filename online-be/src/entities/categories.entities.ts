import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ProductEntity } from "./products.entities";

@Entity("categories")
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  category_id!: number;

  @Column({ type: "varchar", length: 150 })
  category_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  category_image!: string;

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
  })
  @Index("idx_active")
  is_active!: boolean;

  @OneToMany(() => ProductEntity, (products) => products.category, {
    nullable: true,
    onDelete: "SET NULL",
  })
  products!: ProductEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
