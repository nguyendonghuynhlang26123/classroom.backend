import { CacheModule, Module } from '@nestjs/common';
import { UploadFileControllerV1 } from './uploadFile.controller';
import { UploadFileService } from './uploadFile.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [UploadFileControllerV1],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
