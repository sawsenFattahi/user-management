import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { ROLE } from '@lesechos/common/enums/role.enum';
import { UserDto } from '@lesechos/modules/users/dto/user.dto';
import { User } from '@lesechos/modules/users/database/entities/user.entity';
import { IUserRepository } from '@lesechos/modules/users/interfaces/user-repository.interface';

export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(id: string, updates: Partial<User>): Promise<UserDto> {
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

      if ((existingUser.role as unknown) !== (ROLE.ADMIN as unknown)) {
        throw new BadRequestException('Only admins are allowed to update roles.');
      }
    }

    return this.userRepository.update(id, updates);
  }
}
