import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  Req,
  UploadedFile,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { bucket, storage } from 'src/connectFirebase';
import { JwtAuthGuard } from 'src/modules/core/auth/guard/jwt-auth.guard';

@Controller('v1/upload-files')
@ApiTags('Upload Files')
@UseInterceptors(CacheInterceptor)
export class UploadFileControllerV1 {
  constructor() {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/image')
  async uploadImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    if (!file) {
      return res.status(400).send('Error: No files found');
    }
    const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
    const filename =
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    const blob = bucket.file(filename);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobWriter.on('error', (err) => {
      console.log(err);
    });

    blobWriter.on('finish', () => {
      res.status(200).send({ file_name: filename });
    });

    blobWriter.end(file.buffer);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:image_name')
  async getImageUpload(@Res() res, @Param() param: { image_name: string }) {
    const blob = bucket.file(param.image_name);
    const hash = await blob.download();
    res.end(hash[0], 'binary');
  }
}
