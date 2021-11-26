import { CacheModule, Module } from '@nestjs/common';
import { UploadFileControllerV1 } from './uploadFile.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [UploadFileControllerV1],
})
export class UploadFileModule {}
