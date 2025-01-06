import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Role } from '@lesechos/common/enums/role.enum';
import { User } from '@lesechos/modules/users/entities/user.entity';

import { UserDto } from '../../dto/user.dto';
import { IUserRepository } from '../../interfaces/user-repository.interface';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  /**
   * Create a new user in the database.
   * Throws BadRequestException if there is an error creating the user.
   */
  async create(user: User): Promise<UserDto> {
    try {
      const userDocument = new this.userModel(user);
      const savedUser = await userDocument.save();

      return {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role as unknown as Role,
      };
    } catch (error) {
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

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role as unknown as Role,
      };
    } catch (error) {
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
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find a user by username.
   */
  async findByUsername(username: string, withPassword = false): Promise<UserDto | null> {
    try {
      const user = await this.userModel.findOne({ username }).exec();

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

      return users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role as unknown as Role,
      }));
    } catch (error) {
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

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return {
        id: deletedUser.id,
        username: deletedUser.username,
        role: deletedUser.role as unknown as Role,
      };
    } catch (error) {
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }
}
