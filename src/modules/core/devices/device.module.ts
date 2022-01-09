import { Module, CacheModule, Global } from '@nestjs/common';
import { DeviceControllerV1 } from './controller/device.controller';
import { DeviceService } from './services/device.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [DeviceControllerV1],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
