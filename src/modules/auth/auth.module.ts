import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@lesechos/common/strategies/jwt.strategy';
import { environment } from '@lesechos/config/environment';
import { AuthBlacklistService } from '@lesechos/modules/auth/auth-blacklist.service';
import { AuthController } from '@lesechos/modules/auth/auth.controller';
import { DatabaseModule } from '@lesechos/modules/users/database/database.module';
import { UserRepositoryAdapter } from '@lesechos/modules/users/database/repositories/user-repository.adapter';
import { GetUserByIdUseCase } from '@lesechos/modules/users/use-cases/get-user-by-id.use-case';
import { LogoutUserUseCase } from '@lesechos/modules/users/use-cases/logout.use-case';
import { UsersModule } from '@lesechos/modules/users/users.module';
import { AuthenticateUserUseCase } from '@lesechos/modules/auth/use-cases/authenticate-user.use-case';

@Module({
  imports: [
    DatabaseModule,
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
