import * as dotenv from 'dotenv';
dotenv.config();

export const devConfig = {
  app: {
    name: 'ClassroomSystemDev',
    secret: process.env.SECRET,
    refresh_secret: process.env.REFRESH_SECRET,
  },
  mongodb: {
    url: process.env.MONGODB_URL,
  },
};
