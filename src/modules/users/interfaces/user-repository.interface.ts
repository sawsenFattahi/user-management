import type { IUser } from '@lesechos/modules/users/interfaces/user.interface';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  create(user: IUser): Promise<Partial<IUser>>;
  findById(id: string, withPassword?: boolean): Promise<Partial<IUser> | null>;
  findByUsername(username: string, withPassword?: boolean): Promise<Partial<IUser> | null>;
  findAll(
    filters: Partial<IUser>,
    sort: Record<string, 'asc' | 'desc' | 1 | -1>,
    page: number,
    limit: number
  ): Promise<Partial<IUser[]>>;
  update(id: string, updates: Partial<IUser>): Promise<Partial<IUser>>;
  delete(id: string): Promise<Partial<IUser>>;
}
