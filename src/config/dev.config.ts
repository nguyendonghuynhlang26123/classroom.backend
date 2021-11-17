import * as dotenv from 'dotenv';
dotenv.config();

export const devConfig = {
  app: {
    name: 'LofiSystemDev',
    secret: 'daylakhoabimnat',
    refresh_secret: 'daylakhoabimnatrefersakkh',
    environment: {
      local: false,
      dev: true,
      production: false,
    },
    user: {
      username: 'loficmsroot',
      password: '123456',
    },
  },
  mongodb: {
    url: process.env.MONGODB_URL,
    option: { useCreateIndex: true, useNewUrlParser: true },
  },
  telegram: {
    token: '1383186550:AAGOGBJtThfuuLuf1hQIQ1ib20-bnABQ518',
    option: { polling: false },
    rooms: {
      room_log: -445835615,
      room_noti: -478842094,
      room_bug: -359720725,
    },
  },
};
