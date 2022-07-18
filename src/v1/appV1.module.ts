import { Module } from '@nestjs/common';
import { StartModule } from './start/start.module';

@Module({
  imports: [StartModule],
})
export class AppV1Module {}
