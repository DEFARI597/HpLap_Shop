import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entity/users.entity';

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole)
  role: UserRole.ADMIN;
}
