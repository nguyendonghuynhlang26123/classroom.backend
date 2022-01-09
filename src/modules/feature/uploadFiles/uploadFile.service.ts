import { Injectable } from '@nestjs/common';
import * as path from 'path';
var ImageKit = require('imagekit');
var imagekit = new ImageKit({
  publicKey: 'public_xm+LGgkPKYxwp2LhqZN0osZtQf8=',
  privateKey: 'private_MgB6KkHFOT4EV4kG4d4eE5PZQAI=',
  urlEndpoint: 'https://ik.imagekit.io/mv9a74wawbo/',
});

@Injectable()
export class UploadFileService {
  constructor() {
    this.onCreate();
  }

  async uploadImageKit(file) {
    const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
    const filename =
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);

    let data = await imagekit.upload({
      file: file.buffer,
      fileName: filename,
    });
    return data;
  }

  onCreate() {}
}
