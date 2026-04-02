import { IsString, IsOptional, IsBoolean, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @MaxLength(150)
    category_name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    category_image!: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}