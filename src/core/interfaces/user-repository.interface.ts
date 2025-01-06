import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(
    filters: Partial<User>,
    sort: Record<string, 'asc' | 'desc' | 1 | -1>,
    page: number,
    limit: number
  ): Promise<User[]>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
}
