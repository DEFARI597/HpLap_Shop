import {
    Index,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm'

@Entity("categories")
export class CategoriesEntity {
    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column({ type: "varchar", length: 150})
    category_name!: string;

    @Column({
        name: 'parent_category_id',
        nullable: true
    })
    @Index('idx_parent')
    parent_category_id!: number;


    @Column({type: "varchar", length: 255})
    category_image!: string;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true
    })
    @Index('idx_active')
    is_active!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp"})
    updatedAt!: Date;

    @ManyToOne(() => CategoriesEntity, (category) => category.children, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    parent!: CategoriesEntity;

    @OneToMany(() => CategoriesEntity, (category) => category.parent)
    children!: CategoriesEntity[];
}