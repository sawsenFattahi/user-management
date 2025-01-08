import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthBlacklistService } from '@lesechos/modules/auth/auth-blacklist.service';

@Injectable()
export class LogoutUserUseCase {
  constructor(private readonly blacklistService: AuthBlacklistService) {}

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
