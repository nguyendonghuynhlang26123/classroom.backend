import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadFileModule } from 'src/modules/feature/uploadFiles/uploadFile.module';
import { AdminControllerV1 } from './controller/admin.controller';
import { AdminService } from './services/admin.service';

@Global()
@Module({
  imports: [CacheModule.register(), UploadFileModule],
  controllers: [AdminControllerV1],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
