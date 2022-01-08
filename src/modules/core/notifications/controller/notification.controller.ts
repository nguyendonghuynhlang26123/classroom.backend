import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  Query,
  Req,
  Put,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  NotificationInterface,
  GenericQuery,
  GenericRes,
  QueryClassDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/notifications')
@ApiTags('Notifications')
@UseInterceptors(CacheInterceptor)
export class NotificationControllerV1 {
  constructor(private _notificationService: NotificationService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/my-notification')
  async getAllService(
    @Query() query: GenericQuery,
    @Req() req,
  ): Promise<HttpException | GenericRes<NotificationInterface>> {
    return await this._notificationService.getAllNotification(
      query,
      req.user._id,
    );
  }
}
