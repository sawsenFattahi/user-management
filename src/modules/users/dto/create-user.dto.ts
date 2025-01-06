import { Role } from '@le-common/enums/role.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsObject,
  IsEmail,
} from 'class-validator';

/**
 * DTO for creating a user
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsNotEmpty()
  password: string;

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

  @IsEnum(Role, {
    message: 'Role must be either "admin" or "user".',
  })
  @IsNotEmpty()
  role: Role;
}

/**
 * DTO for creating a user with UID
 * Extends CreateUserDto by adding a UID field
 */
export class CreateUserWithUidDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  uid: string;
}
