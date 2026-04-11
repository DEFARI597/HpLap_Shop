import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from "class-validator";

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsEmail()
  @IsNotEmpty()
  customerEmail!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  paymentMethods?: string[];
}
