import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { classes } from '@automapper/classes';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';

import { UserModule } from '../../app/users/users.module';
import { DatabaseModule } from '../configs/databaseConfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/v1/infrastructure/configs/.env',
    }),
    DatabaseModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
})
export class StartModule {}
