import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { User } from '../../../core/entities/user.entity';
import { IUserRepository } from '../../../core/interfaces/user-repository.interface';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  /**
   * Create a new user in the database.
   */
  async create(user: User): Promise<User> {
    // Check if the username already exists
    const existingUser = await this.userModel.findOne({ username: user.username }).exec();

    if (existingUser) {
      throw new BadRequestException(`Username "${user.username}" is already taken.`);
    }
    const userDocument = new this.userModel(user);
    const savedUser = await userDocument.save();
    return new User(savedUser.id, savedUser.username, savedUser.password, savedUser.role);
  }

  /**
   * Update an existing user by ID.
   */
  async update(id: string, updates: Partial<User>): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    await this.validateRestrictedFields(id, updates);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return new User(updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.role);
  }

  /**
   * Find a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    const user = await this.userModel.findById(id).exec();
    return user ? new User(user.id, user.username, user.password, user.role) : null;
  }

  /**
   * Find a user by username.
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user ? new User(user.id, user.username, user.password, user.role) : null;
  }

  /**
   * Find all users with optional filters and sorting.
   */
  async findAll(
    filters: Partial<User> = {},
    sort: Record<string, 'asc' | 'desc' | 1 | -1> = {}
  ): Promise<User[]> {
    const users = await this.userModel.find(filters).sort(sort).exec();

    return users.map((user) => new User(user.id, user.username, user.password, user.role));
  }

  /**
   * Delete a user by ID.
   */
  async delete(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return new User(deletedUser.id, deletedUser.username, deletedUser.password, deletedUser.role);
  }

  /**
   * Validate restricted fields for updates.
   * Prevent updates to 'username' and ensure only admins can update 'role'.
   */
  private async validateRestrictedFields(id: string, updates: Partial<User>): Promise<void> {
    if ('username' in updates) {
      throw new BadRequestException('Updating the username is not allowed.');
    }

    if ('role' in updates) {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      if (user.role !== 'admin') {
        throw new BadRequestException('Only admins are allowed to update roles.');
      }
    }
  }
}
