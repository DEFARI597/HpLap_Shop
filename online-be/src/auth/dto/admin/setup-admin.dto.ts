import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional} from 'class-validator';

export class SetupFirstAdminDto {
    @ApiProperty()
    @IsEmail()
    @IsString()
    email!: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phone?: string;
}