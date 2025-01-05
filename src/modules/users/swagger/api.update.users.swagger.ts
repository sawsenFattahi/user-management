import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

/**
 * Decorator for API body for updating a user
 */
export const ApiUpdateUserBody = () =>
  ApiBody({
    type: Object, // Replace with a DTO type if applicable
    examples: {
      example1: {
        summary: 'Valid update request',
        value: {
          name: 'Updated Name',
          address: { city: 'Los Angeles', zip: '90001' },
          comment: 'Updated admin comment',
          role: 'user',
        },
      },
    },
  });

/**
 * Decorator for API responses for updating a user
 */
export const ApiUpdateUserResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'The user has been successfully updated.',
      schema: {
        example: {
          uid: '456',
          username: 'jane_doe',
          name: 'Updated Name',
          role: 'user',
          address: { city: 'Los Angeles', zip: '90001' },
          comment: 'Updated admin comment',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User with ID "456" not found.',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid data provided.',
          error: 'Bad Request',
        },
      },
    })
  );
