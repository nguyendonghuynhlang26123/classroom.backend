import { Module, CacheModule, CacheInterceptor, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    CacheModule.register(),
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
    Logger,
  ],
})
export class AppModule {}
