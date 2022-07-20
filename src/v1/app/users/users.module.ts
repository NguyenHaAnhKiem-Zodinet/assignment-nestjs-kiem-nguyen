import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './controllers/users.controller';
import { AdminController } from './controllers/admin.controller';
import { UserService } from '../../domain/users/services/user.service';
import { UserMapper } from '../../domain/users/services/mapper.service';
import { Authentication } from '../../domain/users/services/authentication.service';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';
import { User } from '../../domain/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('TIMERESET') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserMapper, Authentication, JwtStrategy],
})
export class UserModule {}
