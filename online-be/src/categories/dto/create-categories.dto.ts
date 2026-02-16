import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @MaxLength(150)
    category_name!: string;

    @IsOptional()
    @IsNumber()
    parent_category_id?: number;

    @IsString()
    @IsUrl()
    @MaxLength(255)
    category_image!: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}