import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@le-entities/user.entity';
import { JwtAuthGuard } from '@le-guards/jwt-auth.guard';
import { RolesGuard } from '@le-guards/roles.guard';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { DeleteUserUseCase } from '@le-use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@le-use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@le-use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@le-use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@le-use-cases/update-user.use-case';
import * as request from 'supertest';

import { UsersController } from './users.controller';

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
    const createdUser = { id: '123', ...createUserDto };
    jest.spyOn(mockRegisterUserUseCase, 'execute').mockResolvedValue(createdUser as User);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual(createdUser);
    expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
  });

  it('should get a user by ID', async () => {
    const userId = '123';
    const user = { id: userId, username: 'testuser' };
    jest.spyOn(mockGetUserByIdUseCase, 'execute').mockResolvedValue(user as User);

    const response = await request(app.getHttpServer()).get(`/users/admin/${userId}`).expect(200);

    expect(response.body).toEqual(user);
    expect(mockGetUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it('should get all users', async () => {
    const users = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
    ];
    jest.spyOn(mockGetAllUsersUseCase, 'execute').mockResolvedValue(users as User[]);

    const response = await request(app.getHttpServer()).get('/users/admin').expect(200);

    expect(response.body).toEqual(users);
    expect(mockGetAllUsersUseCase.execute).toHaveBeenCalledWith({});
  });

  it('should update a user by ID', async () => {
    const userId = '123';
    const updateDto = { username: 'updateduser' };
    const updatedUser = { id: userId, ...updateDto };
    jest.spyOn(mockUpdateUserUseCase, 'execute').mockResolvedValue(updatedUser as User);

    const response = await request(app.getHttpServer())
      .patch(`/users/admin/${userId}`)
      .send(updateDto)
      .expect(200);

    expect(response.body).toEqual(updatedUser);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(userId, updateDto);
  });

  it('should delete a user by ID', async () => {
    const userId = '123';
    jest
      .spyOn(mockDeleteUserUseCase, 'execute')
      .mockResolvedValue({ id: userId, username: 'testuser' } as User);

    const response = await request(app.getHttpServer())
      .delete(`/users/admin/${userId}`)
      .expect(200);

    expect(response.body).toEqual({ id: '123', username: 'testuser' });
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith(userId);
  });
});
