import { Inject, NotFoundException } from '@nestjs/common';

import { IUserRepository } from '@le-interfaces/user-repository.interface';

export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string) {
    try {
      return this.userRepository.findById(userId);
    } catch (error) {
      throw new NotFoundException('User not found', error.message);
    }
  }
}
