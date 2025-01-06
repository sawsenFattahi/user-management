import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { IUserRepository } from '@le-core/interfaces/user-repository.interface';
import { User } from '@le-entities/user.entity';
import { Types } from 'mongoose';

export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(id: string, updates: Partial<User>): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    // Validate restricted fields
    if ('username' in updates) {
      throw new BadRequestException('Updating the username is not allowed.');
    }

    if ('role' in updates) {
      const existingUser = await this.userRepository.findById(id);

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      if (existingUser.role !== 'admin') {
        throw new BadRequestException('Only admins are allowed to update roles.');
      }
    }

    return this.userRepository.update(id, updates);
  }
}
