import type { UserDto } from '@lesechos/modules/users/dto/user.dto';
import type { User } from '@lesechos/modules/users/database/entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<UserDto>;
  findById(id: string, withPassword?: boolean): Promise<UserDto | null>;
  findByUsername(username: string, withPassword?: boolean): Promise<UserDto | null>;
  findAll(
    filters: Partial<User>,
    sort: Record<string, 'asc' | 'desc' | 1 | -1>,
    page: number,
    limit: number
  ): Promise<UserDto[]>;
  update(id: string, updates: Partial<User>): Promise<UserDto>;
  delete(id: string): Promise<UserDto>;
}
