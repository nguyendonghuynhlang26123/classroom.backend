import { Global, Module, Logger } from '@nestjs/common';
import { LoggerUtilService } from './services/loggerUtil.service';

@Global()
@Module({
  providers: [LoggerUtilService, Logger],
  exports: [LoggerUtilService],
})
export class LoggerUtilModule {}
