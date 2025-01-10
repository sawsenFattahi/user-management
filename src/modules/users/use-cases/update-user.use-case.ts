import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { ROLE } from '@lesechos/common/enums/role.enum';
import { UpdateUserDto } from '@lesechos/modules/users/dto/update-user.dto';
import { UserDto } from '@lesechos/modules/users/dto/user.dto';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(id: string, updates: UpdateUserDto): Promise<UserDto> {
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
