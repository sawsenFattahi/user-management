import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(userId: string) {
    try {
      return this.userRepository.delete(userId);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error.message}`);
    }
  }
}
