import { Inject, InternalServerErrorException } from '@nestjs/common';

import { IUserRepository } from '../interfaces/user-repository.interface';

export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string) {
    try {
      return this.userRepository.delete(userId);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error.message}`);
    }
  }
}
