import type { Role } from '@lesechos/common/enums/role.enum';

export interface IUser {
  username: string;
  role: Role;
  password?: string;
  id?: string;
  email?: string;
  name?: string;
  address?: Record<string, any>;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
