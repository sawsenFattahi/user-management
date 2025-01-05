import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthBlacklistService } from '@le-modules/auth/auth-blacklist.service';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly blacklistService: AuthBlacklistService,
    private readonly userRepository: UserRepositoryAdapter
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
      passReqToCallback: true, // Enable access to req in validate
    });
  }

  async validate(req: any, payload: any) {
    const authHeader = req?.headers?.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    if (this.blacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    delete user.password;
    return user;
  }
}
