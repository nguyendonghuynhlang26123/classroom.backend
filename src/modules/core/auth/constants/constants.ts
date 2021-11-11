import APP_CONFIG from '../../../../config';

export const jwtConstants = {
  secret: APP_CONFIG.app.secret,
  refresh_secret: APP_CONFIG.app.refresh_secret,
};
