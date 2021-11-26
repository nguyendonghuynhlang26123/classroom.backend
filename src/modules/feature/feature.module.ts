import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { UploadFileModule } from './uploadFiles/uploadFile.module';

@Module({
  imports: [MailModule, UploadFileModule],
})
export class FeatureModule {}
