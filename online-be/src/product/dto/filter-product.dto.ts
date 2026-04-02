import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductType } from "../../entities/products.entities";

export class ProductFilterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  category_id?: number;

  @IsOptional()
  @IsEnum(ProductType)
  product_type?: ProductType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_featured?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort_by?: string = "created_at";

  @IsOptional()
  @IsString()
  sort_order?: "ASC" | "DESC" = "DESC";
}
