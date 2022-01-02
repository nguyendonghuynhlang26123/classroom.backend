import { IBase } from './base/base.interface';

export class IToken extends IBase {
  user_id: string;
  is_revoked: boolean;
  expires: number;
}

export class IPayLoadToken extends IBase {
  _id: string;
  email?: string;
  name?: string;
  jwt_id?: string;
}
