import { Module, CacheModule, Global } from '@nestjs/common';
import { UploadFileModule } from 'src/modules/feature/uploadFiles/uploadFile.module';
import { UserModule } from '../users/user.module';
import { BlackListControllerV1 } from './controller/blackList.controller';
import { BlackListService } from './services/blackList.service';

@Global()
@Module({
  imports: [CacheModule.register(), UserModule],
  controllers: [BlackListControllerV1],
  providers: [BlackListService],
  exports: [BlackListService],
})
export class BlackListModule {}
