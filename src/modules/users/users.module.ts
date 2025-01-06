import { Module } from '@nestjs/common';

import { DatabaseModule } from '@lesechos/modules/users/database/database.module';
import { UserRepositoryAdapter } from '@lesechos/modules/users/database/repositories/user-repository.adapter';
import { DeleteUserUseCase } from '@lesechos/modules/users/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '@lesechos/modules/users/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@lesechos/modules/users/use-cases/get-user-by-id.use-case';
import { RegisterUserUseCase } from '@lesechos/modules/users/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '@lesechos/modules/users/use-cases/update-user.use-case';
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
