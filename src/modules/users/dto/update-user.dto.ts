import { PartialType } from '@nestjs/mapped-types';

import { Role } from '@le-common/enums/role.enum';
import { CreateUserDto } from '@le-users/dto/create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * DTO for updating a user
 * Extends CreateUserDto with all fields marked as optional
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsOptional()
  username?: string;
}
