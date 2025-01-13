import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

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

export const ApiFindAllUsersQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'filters',
      required: false,
      description: 'Filters to apply to the user list (JSON string)',
      example: '{"role":"ADMIN"}',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      description: 'Sorting criteria (JSON string)',
      example: '{"name":"desc"}',
    })
  );
