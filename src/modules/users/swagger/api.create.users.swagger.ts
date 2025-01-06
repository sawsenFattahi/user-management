import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/create-user.dto';

/**
 * Decorator for API responses for creating a user
 */
export const ApiCreateUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description: 'The user has been successfully created.',
      schema: {
        example: {
          uid: '123',
          username: 'john_doe',
          name: 'John Doe',
          role: 'user',
          address: { city: 'New York', zip: '10001' },
          comment: 'A test user',
        },
      },
    })
  );

export const ApiCreateUserBody = () =>
  applyDecorators(
    ApiBody({
      type: CreateUserDto,
      examples: {
        example1: {
          summary: 'Valid request',
          description: 'A valid user creation request',
          value: {
            username: 'john_doe',
            password: 'password123',
            name: 'John Doe',
            role: 'user',
            address: { city: 'New York', zip: '10001' },
            comment: 'A test user',
          },
        },
      },
    })
  );
