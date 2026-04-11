import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class XenditWebhookDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  external_id!: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  payment_channel?: string;

  @IsOptional()
  @IsString()
  created?: string;

  @IsOptional()
  @IsString()
  paid_at?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  @IsString()
  payment_destination?: string;
}