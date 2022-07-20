import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path: `.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

export const connectionSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: +process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE || 'zodinet',
  entities: ['src/**/**/**/*.entity{.ts,.js}', 'src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/*{.ts,.js}'],
  subscribers: [],
});
