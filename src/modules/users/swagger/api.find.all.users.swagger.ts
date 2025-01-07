import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Decorator for API responses for finding all users
 */

export const ApiFindAllUsersResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'A list of all users.',
      schema: {
        example: [
          {
            uid: '123',
            username: 'john_doe',
            role: 'USER',
          },
          {
            uid: '456',
            username: 'jane_doe',
            role: 'ADMIN',
          },
        ],
      },
    })
  );
