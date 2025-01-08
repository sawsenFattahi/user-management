import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '@lesechos/common/guards/jwt-auth.guard';
import { RolesGuard } from '@lesechos/common/guards/roles.guard';
import { UserRepositoryAdapter } from '@lesechos/modules/users/database/repositories/user-repository.adapter';
import { DeleteUserUseCase } from '@lesechos/modules/users/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@lesechos/modules/users/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@lesechos/modules/users/use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@lesechos/modules/users/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@lesechos/modules/users/use-cases/update-user.use-case';

import { UsersController } from './users.controller';

import type { Role } from '@lesechos/common/enums/role.enum';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let app: INestApplication;
  let mockRegisterUserUseCase: RegisterUserUseCase;
  let mockGetAllUsersUseCase: GetAllUsersUseCase;
  let mockGetUserByIdUseCase: GetUserByIdUseCase;
  let mockUpdateUserUseCase: UpdateUserUseCase;
  let mockDeleteUserUseCase: DeleteUserUseCase;
  const mockUserRepositoryAdapter = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
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

  beforeEach(async () => {
    mockRegisterUserUseCase = { execute: jest.fn() } as any;
    mockGetAllUsersUseCase = { execute: jest.fn() } as any;
    mockGetUserByIdUseCase = { execute: jest.fn() } as any;
    mockUpdateUserUseCase = { execute: jest.fn() } as any;
    mockDeleteUserUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserRepositoryAdapter, useValue: mockUserRepositoryAdapter },
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: GetAllUsersUseCase, useValue: mockGetAllUsersUseCase },
        { provide: GetUserByIdUseCase, useValue: mockGetUserByIdUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
        { provide: DeleteUserUseCase, useValue: mockDeleteUserUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JWT Guard
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock Roles Guard
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a new user', async () => {
    const createUserDto = { username: 'testuser', password: 'password123', role: 'user' };
    const createdUser = createMockUser();
    jest.spyOn(mockRegisterUserUseCase, 'execute').mockResolvedValue(createdUser);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual({
      id: '123',
      password: 'hashedPassword123',
      role: 'user',
      username: 'testuser',
    });
    expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
  });

  it('should get a user by ID', async () => {
    const userId = '123';
    const user = createMockUser({ id: userId });
    jest.spyOn(mockGetUserByIdUseCase, 'execute').mockResolvedValue(user);

    const response = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);

    expect(response.body).toEqual({
      id: '123',
      password: 'hashedPassword123',
      role: 'user',
      username: 'testuser',
    });
    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it('should get all users', async () => {
    const users = [
      createMockUser({ id: '1', username: 'user1' }),
      createMockUser({ id: '2', username: 'user2' }),
    ];
    jest.spyOn(mockGetAllUsersUseCase, 'execute').mockResolvedValue(users);

    const response = await request(app.getHttpServer()).get('/users').expect(200);

    expect(response.body).toEqual([
      { id: '1', password: 'hashedPassword123', role: 'user', username: 'user1' },
      { id: '2', password: 'hashedPassword123', role: 'user', username: 'user2' },
    ]);
    expect(mockGetAllUsersUseCase.execute).toHaveBeenCalledWith({});
  });

  it('should update a user by ID', async () => {
    const userId = '123';
    const updateDto = { username: 'updateduser' };
    const updatedUser = { id: userId, role: 'USER' as Role, ...updateDto };
    jest.spyOn(mockUpdateUserUseCase, 'execute').mockResolvedValue(updatedUser);

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateDto)
      .expect(200);

    expect(response.body).toEqual(updatedUser);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(userId, updateDto);
  });

  it('should delete a user by ID', async () => {
    const userId = '123';
    const user = createMockUser({ id: userId });
    jest.spyOn(mockDeleteUserUseCase, 'execute').mockResolvedValue(user);

    const response = await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);

    expect(response.body).toEqual({
      id: '123',
      username: 'testuser',
      role: 'user',
      password: 'hashedPassword123',
    });
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(userId);
  });
});
