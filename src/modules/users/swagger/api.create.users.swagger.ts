import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from '@lesechos/modules/users/dto/create-user.dto';

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
          id: '123',
          username: 'john_doe',
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
            email: 'm0o4E@example.com',
            role: 'ADMIN',
            address: { city: 'New York', zip: '10001' },
            comment: 'A test user',
          },
        },
      },
    })
  );
