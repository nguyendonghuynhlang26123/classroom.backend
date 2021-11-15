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
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from '../../../connector/repository';
import {
  UserInterface,
  GenericQuery,
  GenericRes,
  UpdateUserDTO,
  ChangePassDTO,
} from 'src/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { imageFileFilter } from 'src/utils/imageFilter';
import { HttpStatus } from '@nestjs/common';

@Controller('v1/users')
@ApiTags('Users')
@UseInterceptors(CacheInterceptor)
export class UserControllerV1 {
  constructor(private userService: UserService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllService(
    @Query() query: GenericQuery,
  ): Promise<HttpException | GenericRes<UserInterface>> {
    return await this.userService.getAllUser(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':user_id')
  async getServiceById(@Param() param: { user_id: string }) {
    const user: User = <User>await this.userService.findUserById(param.user_id);
    return user;
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('changePass/:user_id')
  async changePassService(
    @Request() req,
    @Param() param: { user_id: string },
    @Body() pass: ChangePassDTO,
  ) {
    return await this.userService.changePass(req.user._id, param.user_id, pass);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar_upload', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          let url = join(process.cwd(), '/public/upload/avatars');
          fs.mkdirSync(url, { recursive: true });
          cb(null, url);
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
      fileFilter: imageFileFilter,
    }),
  )
  @Put(':user_id')
  updateUserInfo(
    @Req() req,
    @Body() data: UpdateUserDTO,
    @Param() { user_id },
    @UploadedFile() file: Express.Multer.File,
  ) {
    data.avatar = null;
    if (file) {
      data.avatar = file.filename;
    }
    if (req.user._id != user_id) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    return this.userService
      .updateUser(req.user._id, user_id, data)
      .then((d) => d)
      .catch((e) => {
        throw e;
      });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':user_id')
  async deleteService(@Request() req, @Param() param: { user_id: string }) {
    return await this.userService.deleteUser(req.user, param.user_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('avatar/:fileName')
  getAvatar(@Param() { fileName }, @Res() res) {
    try {
      return res
        .status(200)
        .sendFile(join(process.cwd(), `/public/upload/avatars/${fileName}`));
    } catch (error) {
      console.log(error);
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
