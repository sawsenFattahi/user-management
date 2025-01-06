import { Module } from '@nestjs/common';

import { DeleteUserUseCase } from '@lesechos/core/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@lesechos/core/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@lesechos/core/use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@lesechos/core/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@lesechos/core/use-cases/update-user.use-case';
import { DatabaseModule } from '@lesechos/infrastructure/database/database.module';
import { UserRepositoryAdapter } from '@lesechos/infrastructure/database/repositories/user-repository.adapter';
import { UsersController } from '@lesechos/modules/users/users.controller';

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
