import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '@le-common/enums/role.enum';
import { User } from '@le-entities/user.entity';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { CreateUserDto } from '@le-users/dto/create-user.dto';
import { UpdateUserDto } from '@le-users/dto/update-user.dto';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let userRepository: jest.Mocked<UserRepositoryAdapter>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserRepositoryAdapter,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userRepository = module.get(UserRepositoryAdapter);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        id: '1',
        username: 'testuser',
        password: 'password123',
        role: Role.User,
      };

      const createdUser = {
        id: '1',
        username: createUserDto.username,
        password: createUserDto.password,
        role: createUserDto.role,
      };

      userRepository.create.mockResolvedValue(createdUser as User);

      const result = await usersController.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update current user information', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const req = { user: { id: '1' } };

      const updatedUser = {
        id: req.user.id,
        username: 'testuser',
        role: Role.User,
        ...updateUserDto,
      };

      userRepository.update.mockResolvedValue(updatedUser as User);

      const result = await usersController.updateCurrentUser(req, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(req.user.id, updateUserDto);
    });

    it('should throw an error if user ID is missing', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const req = { user: null };

      await expect(usersController.updateCurrentUser(req, updateUserDto)).rejects.toThrow(
        'User ID is missing from request'
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = { id: userId, username: 'testuser', role: Role.User };

      userRepository.findById.mockResolvedValue(user as User);

      const result = await usersController.findOne(userId);
      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const filters = { role: Role.User };
      const sort = { username: 'asc' };
      const users = [
        { id: '1', username: 'user1', role: Role.User },
        { id: '2', username: 'user2', role: Role.User },
      ];

      userRepository.findAll.mockResolvedValue(users as User[]);

      const result = await usersController.findAll(JSON.stringify(filters), JSON.stringify(sort));
      expect(result).toEqual(users);
      expect(userRepository.findAll).toHaveBeenCalledWith(filters, sort);
    });
  });

  describe('updateUserByAdmin', () => {
    it('should update a user by admin', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: Role.Admin };

      const updatedUser = { id: userId, username: 'testuser', role: Role.Admin };

      userRepository.update.mockResolvedValue(updatedUser as User);

      const result = await usersController.updateUserByAdmin(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      const deletedUser = { id: userId, username: 'testuser', role: Role.User };

      userRepository.delete.mockResolvedValue(deletedUser as User);

      const result = await usersController.deleteUser(userId);
      expect(result).toEqual(deletedUser);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
