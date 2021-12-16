import { HttpException, HttpStatus } from '@nestjs/common';

export const csvFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new HttpException('Only Csv Files Are Allowed!', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};
