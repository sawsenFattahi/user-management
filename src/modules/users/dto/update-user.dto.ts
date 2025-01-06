import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import { ROLE, Role } from '@lesechos/common/enums/role.enum';
import { CreateUserDto } from '@lesechos/modules/users/dto/create-user.dto';

/**
 * DTO for updating a user
 * Extends CreateUserDto with all fields marked as optional
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(ROLE)
  @IsOptional()
  role?: Role;

  @IsOptional()
  username?: string;
}
