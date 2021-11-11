import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConnectorModule } from './connector/connector.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CoreModule,
    ConnectorModule,
    SharedModule
  ],
})
export class ModulesModule {}
