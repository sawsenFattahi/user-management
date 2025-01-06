import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { RolesGuard } from '@le-common/guards/roles.guard';
import { LogoutUserUseCase } from '@le-core/use-cases/logout.use-case';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { AuthenticateUserUseCase } from '@le-use-cases/authenticate-user.use-case';
import { GetUserByIdUseCase } from '@le-use-cases/get-user-by-id.use-case';
import * as request from 'supertest';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let app: INestApplication;
  let mockAuthenticateUserUseCase: AuthenticateUserUseCase;
  let mockGetUserByIdUseCase: GetUserByIdUseCase;
  let mockLogoutUserUseCase: LogoutUserUseCase;

  beforeEach(async () => {
    mockAuthenticateUserUseCase = { execute: jest.fn() } as any;
    mockGetUserByIdUseCase = { execute: jest.fn() } as any;
    mockLogoutUserUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthenticateUserUseCase, useValue: mockAuthenticateUserUseCase },
        { provide: GetUserByIdUseCase, useValue: mockGetUserByIdUseCase },
        { provide: LogoutUserUseCase, useValue: mockLogoutUserUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true), // Allow the guard to pass
        getRequest: jest.fn(() => ({
          user: { id: '123', username: 'testuser', role: 'user' }, // Mocked user object
        })),
      })

      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  function createMockUser(overrides = {}): any {
    return {
      id: '123',
      username: 'testuser',
      role: 'user',
      password: 'hashedPassword123',
      hashPassword: jest.fn(),
      validatePassword: jest.fn(),
      ...overrides, // Allow overriding default properties
    };
  }

  it('should log in a user and return a JWT token', async () => {
    const credentials = { username: 'testuser', password: 'password123' };
    const tokenResponse = { access_token: 'jwt-token' };

    jest.spyOn(mockAuthenticateUserUseCase, 'execute').mockResolvedValue(tokenResponse);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(201);

    expect(response.body).toEqual(tokenResponse);
    expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(credentials);
  });

  it('should get the current user information', async () => {
    const user = createMockUser();
    jest.spyOn(mockGetUserByIdUseCase, 'execute').mockResolvedValue(user);

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer some-token') // Simulate a valid token
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: user.id,
        username: user.username,
        role: user.role,
      })
    );
  });

  it('should log out a user and return a confirmation message', async () => {
    const authHeader = 'Bearer some-token';
    const logoutResponse = { message: 'Logged out successfully' };

    jest.spyOn(mockLogoutUserUseCase, 'execute').mockResolvedValue(logoutResponse);

    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', authHeader)
      .expect(201);

    expect(response.body).toEqual(logoutResponse);
    expect(mockLogoutUserUseCase.execute).toHaveBeenCalledWith(authHeader);
  });

  it('should return 401 if no Authorization header is provided during logout', async () => {
    jest.spyOn(mockLogoutUserUseCase, 'execute').mockImplementation(() => {
      throw new UnauthorizedException('Unauthorized');
    });

    const response = await request(app.getHttpServer())
      .post('/auth/logout') // No Authorization header
      .expect(401); // Expect 401 Unauthorized

    expect(response.body.message).toEqual('Unauthorized');
  });
});
