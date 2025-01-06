import * as bcrypt from 'bcrypt';

export function validatePassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compare(password, hashedPassword);
}
