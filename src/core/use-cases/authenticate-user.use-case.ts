import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

import { IUserRepository } from '../interfaces/user-repository.interface';

export class AuthenticateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: { username: string; password: string }): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByUsername(input.username);
    if (!user || !(await user.validatePassword(input.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // Generate the JWT token
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key', // Use environment variable for secret
      expiresIn: '1h', // Set token expiration time
    });

    return {
      access_token: token,
    };
  }
}
