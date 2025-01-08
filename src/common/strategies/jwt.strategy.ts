import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { environment } from '@lesechos/config/environment';
import { AuthBlacklistService } from '@lesechos/modules/auth/auth-blacklist.service';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@lesechos/modules/users/interfaces/user-repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly blacklistService: AuthBlacklistService,
    readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository // Inject the token
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(environment.JWT_SECRET),
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
    const user = await this.userRepository.findById(payload.sub, true);
    if (!user) {
      throw new Error('User not found');
    }
    delete user.password;

    return user;
  }
}
