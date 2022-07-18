import { Module } from '@nestjs/common';
import { AppV1Module } from './v1/appV1.module';

@Module({
  imports: [AppV1Module],
})
export class AppModule {}
