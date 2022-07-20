import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './users.controller';
import { AdminController } from './admin.controller';
import { UserService } from '../../domain/users/services/user.service';
import { UserMapper } from '../../domain/users/services/mapper.service';
import { Authentication } from '../../domain/users/services/authentication.service';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';
import { User } from '../../domain/users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/v1/infrastructure/configs/.env',
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: process.env.TIMERESET },
    }),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserMapper, Authentication, JwtStrategy],
})
export class UserModule {}
