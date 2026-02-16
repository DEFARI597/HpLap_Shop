import { Exclude, Expose } from 'class-transformer';

export class CategoryResponseDto {
    @Expose()
    category_id!: number;

    @Expose()
    category_name!: string;

    @Expose()
    parent_category_id!: number;

    @Expose()
    category_image!: string;

    @Expose()
    is_active!: boolean;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

    @Expose()
    children?: CategoryResponseDto[];

    @Exclude()
    parent?: CategoryResponseDto;

    constructor(partial: Partial<CategoryResponseDto>) {
        Object.assign(this, partial);
    }
}