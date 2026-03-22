import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
  Min,
  IsInt,
  IsEnum,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductType } from "../../entities/products.entities";

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  product_name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock_quantity!: number;

  @IsEnum(ProductType, {
    message: "Product type must be one of: windows, android, ios, mac",
  })
  product_type!: ProductType;

  @IsOptional()
  @IsUrl()
  product_main_image!: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  product_additional_images!: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  category_id!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand!: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active!: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_featured?: boolean;
}
