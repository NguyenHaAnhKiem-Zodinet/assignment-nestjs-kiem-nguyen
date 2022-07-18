import { Module } from '@nestjs/common';
import { IndexModule } from '../modules/index.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../modules/users/user.entity';

@Module({
  imports: [
    IndexModule,
    ConfigModule.forRoot({
      envFilePath: './src/v1/configs/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DATABASE,
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class StartModule {}
