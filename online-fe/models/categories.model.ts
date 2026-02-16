export class CategoriesEntity {
    category_id!: number;
    category_name!: string;
    parent_category_id!: number;
    category_image!: string
    is_active!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    parent!: CategoriesEntity;
    children!: CategoriesEntity[];
}