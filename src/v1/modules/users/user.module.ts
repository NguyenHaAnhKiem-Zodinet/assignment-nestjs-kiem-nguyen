import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './services/user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from './services/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
