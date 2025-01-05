import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@le-common/interfaces/jwt-payload.interface';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryAdapter
  ) {}

  /**
   * Validates user credentials by comparing the hashed password.
   * @param username - The username of the user
   * @param password - The plaintext password provided by the user
   * @returns A sanitized user object if credentials are valid, otherwise null
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * Generates a JWT token for the authenticated user.
   * @param user - The authenticated user object
   * @returns An object containing the JWT access token
   */
  async login(user: any): Promise<{ access_token: string }> {
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
