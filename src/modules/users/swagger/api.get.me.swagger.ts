import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiGetMeResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Details of the current user.',
      schema: {
        example: {
          id: '123',
          username: 'john_doe',
          role: 'USER',
        },
      },
    })
  );
