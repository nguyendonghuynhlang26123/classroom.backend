import { FileInterceptor } from '@nestjs/platform-express';
import { HttpStatus, UploadedFile } from '@nestjs/common';
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../../core/auth/guard/role.guard';
import { ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/decorators';
import { ImportCsvService } from '../services/importCsv.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { join } from 'path';

@ApiTags('Import Csvs')
@Controller('v1/import-csvs')
export class ImportCsvControllerV1 {
  constructor(private _importCsvService: ImportCsvService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  // @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiFile('csv')
  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(null, join(__dirname, '../../../', '../../public/uploadCsv'));
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadCsv(@UploadedFile() csv) {
    try {
      return await this._importCsvService.uploadCsv(csv);
    } catch (error) {
      return new HttpException('Too Lagge', HttpStatus.PAYLOAD_TOO_LARGE);
    }
  }
}
