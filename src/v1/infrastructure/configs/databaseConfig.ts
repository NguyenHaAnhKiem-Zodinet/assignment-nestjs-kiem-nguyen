import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function typeOrmModuleOptions(): TypeOrmModuleOptions {
  const config = new ConfigService();
  return {
    type: 'mysql',
    host: config.get('MYSQL_HOST'),
    port: Number(config.get('MYSQL_PORT')),
    username: config.get('MYSQL_USER'),
    password: config.get('MYSQL_PASS'),
    database: config.get('MYSQL_DATABASE'),
    entities: ['src/v1/domain/**/*.entity'],
    autoLoadEntities: true,
    migrationsRun: true,
    migrations: ['src/v1/infrastructure/migrations/*'],
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    migrationsTableName: 'migrations_typeorm',
    synchronize: true,
    logging: true,
    logger: 'file',
  };
}

export default () => ({
  database: typeOrmModuleOptions(),
});
