import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerUtilService {
  constructor(private _log: Logger) {}

  log(mess, process) {
    this._log.log(`${mess}`, `${process}`);
  }

  errorLogger(error, process) {
    this._log.error(error, `${error}`, `${process}`);
    console.log(error);
  }
}
