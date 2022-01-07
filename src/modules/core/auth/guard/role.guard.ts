import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums';
import { ALLOWFOR_KEY } from 'src/decorators/allowFors.decorator';
import { ClassService } from '../../classes/services/class.service';
import { AdminService } from '../../admins/services/admin.service';
import { BlackListService } from '../../blackLists/services/blackList.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private _classService: ClassService,
    private _adminService: AdminService,
    private blackListService: BlackListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowForUser = this.reflector.getAllAndOverride<Role[]>(
      ALLOWFOR_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!allowForUser) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest();
    console.log(params);
    if (!user) {
      return false;
    }

    const checkBanAccount = await this.blackListService.findAccountInBlackList(
      user._id,
    );

    if (checkBanAccount) {
      return false;
    }

    if (allowForUser.some((role) => Role.Admin == role)) {
      const admin = await this._adminService.getOneAdmin(user.email);
      if (!admin) {
        return false;
      }
      return true;
    }

    if (!params.class_id) {
      return false;
    }
    const data = await this._classService.getRoleUser(
      params.class_id,
      user._id,
    );
    console.log(data);
    if (!data) {
      return false;
    }
    if (allowForUser.some((role) => data.role == role)) {
      return true;
    }
    return false;
  }
}
