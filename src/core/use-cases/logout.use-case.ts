import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthBlacklistService } from '@le-auth/auth-blacklist.service';
import { IUserRepository } from '@le-core/interfaces/user-repository.interface';

@Injectable()
export class LogoutUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly blacklistService: AuthBlacklistService
  ) {}

  async execute(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    // Blacklist the token
    await this.blacklistService.addToken(token);

    return { message: 'Logged out successfully' };
  }
}
