import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiDeleteUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'The user has been successfully deleted.',
      schema: {
        example: { message: 'User deleted successfully.' },
      },
    })
  );
