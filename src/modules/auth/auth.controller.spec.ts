import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthBlacklistService } from '@le-auth/auth-blacklist.service';
import { AuthService } from '@le-auth/auth.service';
import { RolesGuard } from '@le-common/guards/roles.guard';
import { User } from '@le-entities/user.entity';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let blacklistService: jest.Mocked<AuthBlacklistService>;
  let userRepository: jest.Mocked<UserRepositoryAdapter>;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const mockBlacklistService = {
      addToken: jest.fn(),
    };

    const mockUserRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AuthBlacklistService,
          useValue: mockBlacklistService,
        },
        {
          provide: UserRepositoryAdapter,
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JwtAuthGuard
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock RolesGuard
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    blacklistService = module.get(AuthBlacklistService);
    userRepository = module.get(UserRepositoryAdapter);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const body = { username: 'testuser', password: 'password123' };
      const mockUser = { id: '1', username: 'testuser', role: 'user' };
      const mockToken: { access_token: string } = { access_token: 'test-jwt-token' };

      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockToken);

      const result = await authController.login(body);

      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(body.username, body.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const body = { username: 'wronguser', password: 'wrongpassword' };

      authService.validateUser.mockResolvedValue(null);

      await expect(authController.login(body)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(body.username, body.password);
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user details', async () => {
      const mockUserId = '1';
      const req = { user: { id: mockUserId } };
      const mockUser = { id: mockUserId, username: 'testuser', role: 'user' };

      userRepository.findById.mockResolvedValue(mockUser as User);

      const result = await authController.getCurrentUser(req);

      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw UnauthorizedException if user ID is missing', async () => {
      const req = { user: null };

      await expect(authController.getCurrentUser(req)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const mockUserId = '1';
      const req = { user: { id: mockUserId } };

      userRepository.findById.mockResolvedValue(null);

      await expect(authController.getCurrentUser(req)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('logout', () => {
    it('should blacklist the token and return a success message', async () => {
      const mockToken = 'test-token';
      const req = {
        headers: { authorization: `Bearer ${mockToken}` },
      };

      const result = await authController.logout(req);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(blacklistService.addToken).toHaveBeenCalledWith(mockToken);
    });

    it('should throw UnauthorizedException if authorization header is missing', async () => {
      const req = { headers: {} };

      await expect(authController.logout(req)).rejects.toThrow(UnauthorizedException);
      expect(blacklistService.addToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      const req = { headers: { authorization: 'Bearer ' } };

      await expect(authController.logout(req)).rejects.toThrow(UnauthorizedException);
      expect(blacklistService.addToken).not.toHaveBeenCalled();
    });
  });
});
