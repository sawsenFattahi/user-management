import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@le-entities/user.entity';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userRepository: jest.Mocked<UserRepositoryAdapter>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockUserRepository = {
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserRepositoryAdapter,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    userRepository = module.get(UserRepositoryAdapter);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return sanitized user object if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        role: 'user',
        password: 'password123',
        validatePassword: jest.fn().mockReturnValue(true),
      };

      userRepository.findByUsername.mockResolvedValue(mockUser as User);

      const result = await authService.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
      });
      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
    });

    it('should throw UnauthorizedException if username does not exist', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(authService.validateUser('nonexistent', 'password123')).rejects.toThrow(
        UnauthorizedException
      );
      expect(userRepository.findByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        role: 'user',
        password: 'password123',
        validatePassword: jest.fn().mockReturnValue(false),
      };

      userRepository.findByUsername.mockResolvedValue(mockUser as User);

      await expect(authService.validateUser('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException
      );
      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrongpassword');
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        role: 'user',
      };

      const mockToken = 'test-jwt-token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          username: mockUser.username,
          role: mockUser.role,
        },
        {
          secret: process.env.JWT_SECRET || 'your-secret-key',
          expiresIn: '1h',
        }
      );
    });
  });
});
