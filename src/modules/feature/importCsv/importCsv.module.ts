import { Module } from '@nestjs/common';
import { ImportCsvControllerV1 } from './controller/importCsv.controller';
import { ImportCsvService } from './services/importCsv.service';

@Module({
  imports: [],
  controllers: [ImportCsvControllerV1],
  providers: [ImportCsvService],
  exports: [ImportCsvService],
})
export class ImportCsvModule {}
