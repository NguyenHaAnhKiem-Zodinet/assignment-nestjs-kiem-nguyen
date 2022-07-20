import { Module } from '@nestjs/common';
import { StartModule } from './v1/infrastructure/start/start.module';

@Module({
  imports: [StartModule],
})
export class AppModule {}
