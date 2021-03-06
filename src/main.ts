import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { RedisIoAdapter } from './socket.adapter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    // httpsOptions,
  });
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(new ValidationPipe());
  // app.useWebSocketAdapter(new RedisIoAdapter(app));

  app.use(cookieParser());
  const allowList = [
    'https://btcn02-18127136-18127269.netlify.app',
    'https://moorssalc-app.herokuapp.com',
    'http://localhost:3000',
    'http://localhost:4000',
    'https://nguyendonghuynhlang26123.github.io',
    'ws://localhost:8080',
  ];
  app.enableCors((req, callback) => {
    let corsOptions = {
      credentials: true,
      origin: true,
      exposedHeaders: ['set-cookie'],
    };
    if (allowList.indexOf(req.header('Origin')) !== -1) {
      corsOptions['origin'] = true; // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions['origin'] = false; // disable CORS for this request
    }
    return callback(null, corsOptions);
  });
  if (process.env.NODE_ENV != 'production') {
    app.use(csurf({ cookie: { httpOnly: true } }));
    app.use(function (req, res, next) {
      var token = req.csrfToken();
      res.cookie('XSRF-TOKEN', token);
      res.locals.csrfToken = token;
      next();
    });
  }

  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('invalid XSRF-TOKEN');
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Classroom')
    .setDescription('The classroom API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('docs', app, document);
  await app.listen(parseInt(process.env.PORT) || 3001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
