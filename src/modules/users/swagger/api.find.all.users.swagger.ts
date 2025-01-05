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
            name: 'John Doe',
            role: 'user',
            address: { city: 'New York', zip: '10001' },
            comment: 'A test user',
          },
          {
            uid: '456',
            username: 'jane_doe',
            name: 'Jane Doe',
            role: 'admin',
            address: { city: 'Los Angeles', zip: '90001' },
            comment: 'An admin user',
          },
        ],
      },
    })
  );
