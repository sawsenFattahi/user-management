import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiGetOneUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Details of the user with the given UID.',
      schema: {
        example: {
          id: '456',
          name: 'Jane Doe',
          role: 'ADMIN',
        },
      },
    })
  );
