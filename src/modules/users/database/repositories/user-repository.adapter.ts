import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Role } from '@lesechos/common/enums/role.enum';
import { User, UserDocument } from '@lesechos/modules/users/database/mongo/entities/user.entity';
import { UserDto } from '@lesechos/modules/users/dto/user.dto';
import { IUserRepository } from '@lesechos/modules/users/interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}
  private readonly logger = new Logger(UserRepositoryAdapter.name);
  /**
   * Create a new user in the database.
   * Throws BadRequestException if there is an error creating the user.
   */
  async create(user: User): Promise<UserDto> {
    try {
      const userDocument = new this.userModel(user);
      const savedUser = await userDocument.save();

      this.logger.log(`User created with ID: ${savedUser.id}`);

      return {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role as unknown as Role,
      };
    } catch (error) {
      this.logger.error(`Error checking data: ${error.message}`);
      throw new BadRequestException(`Error checking data: ${error.message}`);
    }
  }

  /**
   * Update an existing user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws BadRequestException if there is an error updating the user.
   */
  async update(id: string, updates: Partial<User>): Promise<UserDto> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        .exec();

      this.logger.log(`User updated with ID: ${updatedUser.id}`);

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role as unknown as Role,
      };
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      throw new BadRequestException(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Find a user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws BadRequestException if there is an error finding the user.
   */
  async findById(id: string, withPassword = false): Promise<UserDto | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    try {
      const user = await this.userModel.findById(id).exec();

      this.logger.log(`Found user with ID: ${user.id}`);

      const userById: UserDto = user
        ? {
            id: user.id,
            username: user.username,
            role: user.role as unknown as Role,
          }
        : null;
      if (withPassword) {
        userById.password = user.password; // Include the password if requested
      }

      return userById;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find a user by username.
   */
  async findByUsername(username: string, withPassword = false): Promise<UserDto | null> {
    try {
      const user = await this.userModel.findOne({ username }).exec();

      this.logger.log(`Found user with username: ${username}`);

      const userByName: UserDto = user
        ? {
            id: user.id,
            username: user.username,
            role: user.role as unknown as Role,
          }
        : null;
      if (withPassword) {
        userByName.password = user.password; // Include the password if requested
      }

      return userByName;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find all users with optional filters and sorting.
   */
  async findAll(
    filters: Partial<UserDto> = {},
    sort: Record<string, 'asc' | 'desc' | 1 | -1> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<UserDto[]> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userModel
        .find(filters)
        .sort(sort)
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit the number of documents returned.exec();
      this.logger.log(`Found ${users.length} users`);

      return users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role as unknown as Role,
      }));
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`);
      throw new BadRequestException(`Error finding users: ${error.message}`);
    }
  }

  /**
   * Delete a user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws BadRequestException if there is an error deleting the user.
   */
  async delete(id: string): Promise<UserDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      this.logger.log(`User deleted with ID: ${deletedUser.id}`);

      if (!deletedUser) {
        this.logger.error(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      this.logger.log(`User deleted with ID: ${deletedUser.id}`);

      return {
        id: deletedUser.id,
        username: deletedUser.username,
        role: deletedUser.role as unknown as Role,
      };
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }
}
