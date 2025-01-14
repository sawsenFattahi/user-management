import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { ROLE, Role } from '@lesechos/common/enums/role.enum';

/**
 * DTO  user
 */
export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  address?: Record<string, any>;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsEnum(ROLE, {
    message: 'Role must be either "ADMIN" or "USER".',
  })
  @IsNotEmpty()
  role: Role;
}
