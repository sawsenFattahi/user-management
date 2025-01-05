import * as bcrypt from 'bcrypt';

export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public role: 'user' | 'admin',
    public name?: string,
    public address?: Record<string, any>,
    public comment?: string
  ) {}

  validatePassword(password: string): boolean {
    return bcrypt.compare(password, this.password);
  }
}
