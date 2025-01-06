import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@lesechos/common/strategies/jwt.strategy';
import { environment } from '@lesechos/config/environment';
import { AuthenticateUserUseCase } from '@lesechos/core/use-cases/authenticate-user.use-case';
import { GetUserByIdUseCase } from '@lesechos/core/use-cases/get-user-by-id.use-case';
import { LogoutUserUseCase } from '@lesechos/core/use-cases/logout.use-case';
import { UserRepositoryAdapter } from '@lesechos/infrastructure/database/repositories/user-repository.adapter';
import { UserSchema } from '@lesechos/infrastructure/database/schemas/user.schema';
import { AuthBlacklistService } from '@lesechos/modules/auth/auth-blacklist.service';
import { AuthController } from '@lesechos/modules/auth/auth.controller';
import { UsersModule } from '@lesechos/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(environment.JWT_SECRET),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
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
