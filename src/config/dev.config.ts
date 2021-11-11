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
    url: 'mongodb+srv://admin:admin2020@cluster0.clc8a.azure.mongodb.net/classroom',
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
