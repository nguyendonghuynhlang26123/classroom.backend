export class IConfig {
  app: {
    name: string;
    secret: string;
    refresh_secret: string;
  };
  mongodb: {
    url: string;
  };
}
