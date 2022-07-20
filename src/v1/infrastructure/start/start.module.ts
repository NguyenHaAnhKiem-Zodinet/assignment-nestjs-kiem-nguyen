import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { classes } from '@automapper/classes';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';

import { UserModule } from 'src/v1/app/users/users.module';
import databaseConfig from '../configs/databaseConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: './src/v1/infrastructure/configs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get<TypeOrmModuleOptions>('database'),
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
})
export class StartModule {}
