import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthBlacklistService } from '@le-auth/auth-blacklist.service';
import { AuthController } from '@le-auth/auth.controller';
import { GetUserByIdUseCase } from '@le-core/use-cases/get-user-by-id.use-case';
import { LogoutUserUseCase } from '@le-core/use-cases/logout.use-case';
import { UserRepositoryAdapter } from '@le-repositories/user-repository.adapter';
import { UserSchema } from '@le-schemas/user.schema';
import { JwtStrategy } from '@le-strategies/jwt.strategy';
import { UsersModule } from '@le-users/users.module';
import { AuthenticateUserUseCase } from 'src/core/use-cases/authenticate-user.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryAdapter,
    },
    UserRepositoryAdapter,
    JwtStrategy,
    AuthBlacklistService,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    LogoutUserUseCase,
  ],
  exports: [AuthBlacklistService],
})
export class AuthModule {}
