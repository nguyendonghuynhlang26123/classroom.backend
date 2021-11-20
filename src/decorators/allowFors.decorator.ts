import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums';

export const ALLOWFOR_KEY = 'allowFor';
export const AllowFors = (...roles: Role[]) =>
  SetMetadata(ALLOWFOR_KEY, roles);
