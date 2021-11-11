import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '../../token/token.service';

@Injectable()
export class LogOutService {
  constructor(private _tokenService: TokenService) {}

  async logOutAllDevice(user) {
    try {
      return await this._tokenService.revokeAllToken(user._id, user.user_type);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
