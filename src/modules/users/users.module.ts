import { Module } from '@nestjs/common';

import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { UsersController } from '@le-users/users.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController], // Register the controller
  providers: [UserRepositoryAdapter], // Register the service
  exports: [UserRepositoryAdapter], // Export the service for use in other modules
})
export class UsersModule {}
