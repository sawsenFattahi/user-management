import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';

@Injectable()
export class GetUserByIdUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(userId: string) {
    try {
      return this.userRepository.findById(userId);
    } catch (error) {
      throw new NotFoundException('User not found', error.message);
    }
  }
}
