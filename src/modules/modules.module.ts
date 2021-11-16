import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConnectorModule } from './connector/connector.module';
import { SharedModule } from './shared/shared.module';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [CoreModule, ConnectorModule, FeatureModule, SharedModule],
})
export class ModulesModule {}
