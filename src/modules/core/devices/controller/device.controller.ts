import {
  Controller,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/users')
@ApiTags('User Activations')
@UseInterceptors(CacheInterceptor)
export class DeviceControllerV1 {
  constructor(private _deviceService: DeviceService) {}
}
