import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/enums';

export const ALLOWFOR_KEY = 'allowFor';
export const AllowFors = (...userType: UserType[]) =>
  SetMetadata(ALLOWFOR_KEY, userType);
