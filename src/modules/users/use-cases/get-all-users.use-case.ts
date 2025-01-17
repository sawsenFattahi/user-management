import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';
import { IUser } from '@lesechos/modules/users/interfaces/user.interface';

@Injectable()
export class GetAllUsersUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(query: {
    filters?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<Partial<IUser[]>> {
    // Parse filters from string to object
    const filters: Record<string, any> = query.filters ? JSON.parse(query.filters) : {};

    // Parse sort from string to object and provide default sort
    const sort: Record<string, 'asc' | 'desc' | 1 | -1> = query.sort
      ? JSON.parse(query.sort)
      : { createdAt: 'desc' };

    const page = query.page || 1;
    const limit = query.limit || 10;
    try {
      // Pass the processed parameters to the repository
      return this.userRepository.findAll(filters, sort, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(`Error finding users: ${error.message}`);
    }
  }
}
