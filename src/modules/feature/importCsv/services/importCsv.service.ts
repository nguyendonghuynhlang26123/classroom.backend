'use strict';

import { Injectable } from '@nestjs/common';
let csvToJson = require('convert-csv-to-json');

@Injectable()
export class ImportCsvService {
  constructor() {
    this.onCreate();
  }

  async importFile(csvName: string) {
    const result = csvToJson.fieldDelimiter(',').getJsonFromCsv(csvName);
    return result;
  }

  uploadCsv(file) {
    console.log(file.path);
    this.importFile(file.path);
    return file;
  }

  onCreate() {}
}
