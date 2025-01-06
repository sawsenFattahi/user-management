import { Role } from '@le-common/enums/role.enum';
import * as bcrypt from 'bcrypt';

export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public role: Role,
    public name?: string,
    public address?: Record<string, any>,
    public comment?: string
  ) {}

  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  validatePassword(password: string): boolean {
    return bcrypt.compare(password, this.password);
  }
}
