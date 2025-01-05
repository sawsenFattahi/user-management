import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiGetMeResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Details of the current user.',
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
