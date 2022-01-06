import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  Param,
  UseGuards,
  Request,
  Put,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  Query,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from 'src/decorators';
import { UploadFileService } from 'src/modules/feature/uploadFiles/uploadFile.service';
import { RolesGuard } from '../../auth/guard/role.guard';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';

@Controller('v1/admins')
@ApiTags('Admins')
@UseInterceptors(CacheInterceptor)
export class AdminControllerV1 {
  constructor(
    private adminService: AdminService,
    private uploadFileService: UploadFileService,
  ) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  async uploadAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    if (!file) {
      return res.status(400).send('Error: No files found');
    }
    let data = await this.uploadFileService.uploadImageKit(file);
    return await this.adminService.uploadAvatar(req.user._id, data.url);
  }
}
