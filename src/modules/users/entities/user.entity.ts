import type { Role } from '@lesechos/common/enums/role.enum';
import { Entity } from 'typeorm';

@Entity()
export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public role: Role,
    public email?: string,
    public name?: string,
    public address?: Record<string, any>,
    public comment?: string
  ) {}
}
