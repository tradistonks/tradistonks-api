import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { StrategiesController } from './strategies.controller';
import { StrategiesService } from './strategies.service';

@Module({
  controllers: [StrategiesController],
  providers: [StrategiesService],
  exports: [StrategiesService],
  imports: [SchemasModule],
})
export class StrategiesModule {}
