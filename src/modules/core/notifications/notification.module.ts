import { Module, CacheModule, Global } from '@nestjs/common';
import { NotificationControllerV1 } from './controller/notification.controller';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [NotificationControllerV1],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
