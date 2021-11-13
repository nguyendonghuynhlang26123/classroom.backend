import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TokenRepository } from '../../connector/repository';
import { IToken } from './token.interface';

@Injectable()
export class TokenService {
  constructor(private _tokenRepository: TokenRepository) {
    this.removeAllToken();
  }

  async createToken(userType: string, userID, expires) {
    try {
      const data: IToken = {
        user_id: `${userType}#${userID}`,
        expires: expires,
        is_revoked: false,
      };
      const createToken = new this._tokenRepository._model(data);
      const token = await this._tokenRepository.create(createToken);
      return token;
    } catch (error) {
      if (error.code == 11000 || error.code == 11001) {
        throw new HttpException(
          `Duplicate key error collection: ${Object.keys(error.keyValue)}`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getToken(id) {
    try {
      const token = await this._tokenRepository.getOneDocument({ _id: id });
      if (!token) {
        throw new HttpException('', HttpStatus.UNAUTHORIZED);
      }

      return token;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async revokeToken(id) {
    try {
      const token = await this._tokenRepository.getOneDocument({ _id: id });
      if (!token) {
        return;
      }
      await this._tokenRepository.updateDocument(
        { _id: id },
        { is_revoked: true },
      );
      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async revokeAllToken(userId: string, userType: string) {
    try {
      await this._tokenRepository.updateAllDocument(
        { user_id: `${userType}#${userId}` },
        { is_revoked: true },
      );
      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeToken(id) {
    try {
      await this._tokenRepository.removeDocument({ _id: id });
      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeAllToken() {
    try {
      await Promise.all([
        this._tokenRepository.removeAllDocument({
          is_revoked: true,
        }),
        this._tokenRepository.removeAllDocument({
          expires: { $lte: Date.now() },
        }),
      ]);
      return;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
