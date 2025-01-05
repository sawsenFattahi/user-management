import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { UpdateUserDto } from '../dto/update-user.dto';

export const ApiUpdteMeBody = () =>
  applyDecorators(
    ApiBody({
      type: UpdateUserDto,
      examples: {
        example1: {
          summary: 'Valid update request',
          value: {
            name: 'Updated Name',
            address: { city: 'San Francisco', zip: '94105' },
            comment: 'Updated comment',
          },
        },
      },
    })
  );

export const ApiUpdateMeResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'The user has been successfully updated.',
      schema: {
        example: {
          uid: '123',
          username: 'john_doe',
          name: 'Updated Name',
          role: 'user',
          address: { city: 'San Francisco', zip: '94105' },
          comment: 'Updated comment',
        },
      },
    })
  );
