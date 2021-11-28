import { Module } from '@nestjs/common';
import { ImportCsvModule } from './importCsv/importCsv.module';
import { MailModule } from './mail/mail.module';
import { UploadFileModule } from './uploadFiles/uploadFile.module';

@Module({
  imports: [MailModule, UploadFileModule, ImportCsvModule],
})
export class FeatureModule {}
