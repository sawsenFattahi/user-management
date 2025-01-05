import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiGetOneUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Details of the user with the given UID.',
      schema: {
        example: {
          uid: '456',
          username: 'jane_doe',
          name: 'Jane Doe',
          role: 'admin',
          address: { city: 'Los Angeles', zip: '90001' },
          comment: 'An admin user',
        },
      },
    })
  );
