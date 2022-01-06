import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminControllerV1 } from './controller/admin.controller';
import { AdminService } from './services/admin.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [AdminControllerV1],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
