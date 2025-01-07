import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiDeleteUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'The user has been successfully deleted.',
      schema: {
        example: {
          username: 'john_doe',
          name: 'John Doe',
          role: 'ADMIN',
        },
      },
    })
  );
