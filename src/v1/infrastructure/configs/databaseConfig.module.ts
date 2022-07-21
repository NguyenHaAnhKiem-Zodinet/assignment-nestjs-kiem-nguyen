import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: +process.env.MYSQL_PORT || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASS || 'Anhkiem0701',
        database: process.env.MYSQL_DATABASE || 'zodinet',
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/../migrations/',
        },
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        migrationsTableName: 'migrations_typeorm',
        synchronize: true,
        logging: true,
        logger: 'file',
      }),
    }),
  ],
  providers: [ConfigService],
})
export class DatabaseModule {}

export const connectionSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASS || 'Anhkiem0701',
  database: process.env.MYSQL_DATABASE || 'zodinet',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  synchronize: true,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
});
