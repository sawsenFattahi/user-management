import { BadRequestException, Inject } from '@nestjs/common';

import { Role } from '@lesechos/common/enums/role.enum';
import { hashPassword } from '@lesechos/common/utils/hash-password';
import { mapToRole } from '@lesechos/common/utils/map-to-role';
import { UserDto } from '@lesechos/modules/users/dto/user.dto';
import { User } from '@lesechos/modules/users/database/entities/user.entity';
import { IUserRepository } from '@lesechos/modules/users/interfaces/user-repository.interface';

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
  }): Promise<UserDto> {
    const updateUser: Partial<User> = {
      ...input,
      role: input.role ? mapToRole(input.role as unknown as Role) : undefined, // Valider ou mapper le rôle
    };
    const user = new User(
      input.username,
      input.password,
      updateUser.role,
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
