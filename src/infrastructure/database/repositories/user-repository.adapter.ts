import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from '@lesechos/core/entities/user.entity';
import { IUserRepository } from '@lesechos/core/interfaces/user-repository.interface';
import { UserDocument } from '@lesechos/infrastructure/database/schemas/user.schema';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  /**
   * Create a new user in the database.
   * Throws InternalServerErrorException if there is an error creating the user.
   */
  async create(user: User): Promise<User> {
    try {
      const userDocument = new this.userModel(user);
      const savedUser = await userDocument.save();

      return new User(savedUser.id, savedUser.username, savedUser.password, savedUser.role);
    } catch (error) {
      throw new InternalServerErrorException(`Error checking data: ${error.message}`);
    }
  }

  /**
   * Update an existing user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws InternalServerErrorException if there is an error updating the user.
   */
  async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        .exec();

      return new User(updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.role);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Find a user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws InternalServerErrorException if there is an error finding the user.
   */
  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    try {
      const user = await this.userModel.findById(id).exec();

      return user
        ? new User(
            user.id,
            user.username,
            user.password,
            user.role,
            user.email,
            user.name,
            user.address,
            user.comment
          )
        : null;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find a user by username.
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ username }).exec();

      return user ? new User(user.id, user.username, user.password, user.role) : null;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user: ${error.message}`);
    }
  }

  /**
   * Find all users with optional filters and sorting.
   */
  async findAll(
    filters: Partial<User> = {},
    sort: Record<string, 'asc' | 'desc' | 1 | -1> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<User[]> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userModel
        .find(filters)
        .sort(sort)
        .skip(skip) // Skip documents for pagination
        .limit(limit); // Limit the number of documents returned.exec();

      return users.map((user) => new User(user.id, user.username, user.password, user.role));
    } catch (error) {
      throw new InternalServerErrorException(`Error finding users: ${error.message}`);
    }
  }

  /**
   * Delete a user by ID.
   * Throws NotFoundException if the user is not found.
   * Throws InternalServerErrorException if there is an error deleting the user.
   */
  async delete(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return new User(deletedUser.id, deletedUser.username, deletedUser.password, deletedUser.role);
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user: ${error.message}`);
    }
  }
}
