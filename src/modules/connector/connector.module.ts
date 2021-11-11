import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    RepositoryModule
  ],
})
export class ConnectorModule {}
