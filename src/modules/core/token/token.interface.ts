import { IBase } from 'src/interfaces/base/base.interface';
export class IToken extends IBase {
  user_id: string;
  is_revoked: boolean;
  expires: number;
}
