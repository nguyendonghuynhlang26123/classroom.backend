import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import APP_CONFIG from '../config';
const algorithm = 'aes-256-cbc';
const secret = APP_CONFIG.app.secret;
const key = crypto
  .createHash('sha256')
  .update(String(secret))
  .digest('base64')
  .substr(0, 32);
const iv = crypto.randomBytes(16);
@Injectable()
export class HashBryct {
  async hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  encrypt(text): Promise<string> {
    return new Promise((res, rej) => {
      let cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return res(
        JSON.stringify({
          iv: iv.toString('hex'),
          encryptedData: encrypted.toString('hex'),
        }),
      );
    });
  }

  decrypt(text): Promise<string> {
    return new Promise((res, rej) => {
      text = JSON.parse(text);
      let iv = Buffer.from(text.iv, 'hex');
      let encryptedText = Buffer.from(text.encryptedData, 'hex');
      let decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return res(decrypted.toString());
    });
  }
}
