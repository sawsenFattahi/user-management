import { Inject, InternalServerErrorException } from '@nestjs/common';

import { Role } from '@le-common/enums/role.enum';
import { User } from '@le-entities/user.entity';
import { IUserRepository } from '@le-interfaces/user-repository.interface';

export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: {
    username: string;
    email?: string;
    password: string;
    role: Role;
    name?: string;
    address?: Record<string, any>;
    comment?: string;
  }) {
    const user = new User(
      Date.now().toString(),
      input.username,
      input.password,
      input.role,
      input.name,
      input.address,
      input.comment
    );
    await user.hashPassword(); // Hash the password
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw new InternalServerErrorException(`Error checking data: ${error.message}`);
    }
  }
}
