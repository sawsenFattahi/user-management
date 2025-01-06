import { Module } from '@nestjs/common';

import { DeleteUserUseCase } from '@le-core/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '@le-core/use-cases/update-user.use-case';
import { DatabaseModule } from '@le-infrastructure/database/database.module';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { GetAllUsersUseCase } from '@le-use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@le-use-cases/get-user-by-id.use-case';
import { UsersController } from '@le-users/users.controller';
import { RegisterUserUseCase } from 'src/core/use-cases/register-user.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController], // Register the controller
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryAdapter,
    },
    UserRepositoryAdapter,
    RegisterUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ], // Register the service
  exports: [UserRepositoryAdapter, RegisterUserUseCase], // Export the service for use in other modules
})
export class UsersModule {}
