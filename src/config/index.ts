// import { devConfig } from './dev.config';
import { IConfig } from './config.interface';
import { devConfig } from './dev.config';
import { localConfig } from './local.config';
// import { join } from 'path';
let APP_CONFIG: IConfig;
// const fs = require(`fs`);

// try {
//   const data = fs.readFileSync('lofi-config.json');
//   APP_CONFIG = JSON.parse(data);
// } catch (error) {
//   let data = fs.readFileSync('lofi-config.example.json');
//   let jsonString = JSON.stringify(JSON.parse(data));
//   fs.writeFileSync('lofi-config.json', jsonString);
//   data = fs.readFileSync('lofi-config.json');
//   APP_CONFIG = JSON.parse(data);
// }
// export default APP_CONFIG;

// export default () => ({
//   port: parseInt(process.env.PORT, 10) || 3000,
//   database: {
//     host: process.env.DATABASE_HOST,
//     port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
//   },
// });
APP_CONFIG = devConfig;
if (process.env.NODE_ENV == 'local') {
  APP_CONFIG = localConfig;
}

export default APP_CONFIG;
// const config = require('../../lofi-config.json');
//lofi-config.example.json
