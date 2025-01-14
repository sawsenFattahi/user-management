import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { hashPassword } from '@lesechos/common/utils/hash-password';
import { User } from '@lesechos/modules/users/database/mongo/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';
import { IUser } from '@lesechos/modules/users/interfaces/user.interface';

import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserDto): Promise<Partial<IUser>> {
    const user = new User(
      input.username,
      input.password,
      input.role,
      input.email,
      input.name,
      input.address,
      input.comment
    );
    user.password = await hashPassword(input.password); // Hash the password
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw new BadRequestException(`Error checking data: ${error.message}`);
    }
  }
}
