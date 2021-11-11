import { Module } from '@nestjs/common';
import { LoggerUtilModule } from './loggerUtil/loggerUtil.module';

@Module({
  imports: [LoggerUtilModule],
})
export class SharedModule {}
