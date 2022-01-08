import { Module, CacheModule, Global } from '@nestjs/common';
import { NotificationControllerV1 } from './controller/notification.controller';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [NotificationControllerV1],
  providers: [
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
