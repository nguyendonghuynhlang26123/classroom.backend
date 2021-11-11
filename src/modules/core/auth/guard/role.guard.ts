// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { UserType, Role } from 'src/enums';
// import { ROLES_KEY, PERMISSIONS_KEY } from 'src/decorators';
// import { ALLOWFOR_KEY } from 'src/decorators/allowFors.decorator';
// import { UserRoleService } from '../../userRole/services/userRole.service';
// import { UserService } from '../../users/services/user.service';
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private _roleService: UserRoleService,
//     private _userService: UserService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     const allowForUser = this.reflector.getAllAndOverride<UserType[]>(
//       ALLOWFOR_KEY,
//       [context.getHandler(), context.getClass()],
//     );
//     const requiredPermissions = this.reflector.getAllAndOverride<Role[]>(
//       PERMISSIONS_KEY,
//       [context.getHandler(), context.getClass()],
//     );
//     if (!requiredPermissions && !allowForUser) {
//       return true;
//     }

//     const { user, params } = context.switchToHttp().getRequest();
//     if (!user) {
//       return false;
//     }
//     if (allowForUser.some((userType) => user.user_type == userType)) {
//       if (user.user_type == UserType.Customer) {
//         return true;
//       }
//       if (user.user_type == UserType.User) {
//         if (
//           !requiredPermissions ||
//           !requiredPermissions.length ||
//           user.is_admin ||
//           user.is_root
//         ) {
//           return true;
//         }

//         const dataUser = await this._userService.getOneUser(user.username);
//         if (!dataUser) {
//           return false;
//         }
//         // user.user_role
//         const data = [];
//         dataUser.user_role.forEach((element) => {
//           data.push(this._roleService.getRoleById(element));
//         });

//         const allRole = await Promise.all(data);

//         let userPermission = [];
//         allRole.forEach((element) => {
//           if (element) {
//             userPermission.push(...element.role_permission);
//           }
//         });
//         userPermission = [...new Set(userPermission)];
//         return requiredPermissions.some((permission) =>
//           userPermission.some((e) => e == permission),
//         );
//       }
//     }
//     return false;
//   }
// }
