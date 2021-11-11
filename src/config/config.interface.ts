export class IConfig {
  app: {
    name: string;
    secret: string;
    refresh_secret: string;
    environment: {
      local: boolean;
      dev: boolean;
      production: boolean;
    };
    user: {
      username: string;
      password: string;
    };
  };
  mongodb: {
    url: string;
    option: { useCreateIndex: boolean; useNewUrlParser: boolean };
  };
  telegram: {
    token: string;
    option: { polling: boolean };
    rooms: {
      room_log: number;
      room_noti: number;
      room_bug: number;
    };
  };
}
