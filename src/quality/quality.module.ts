import { Module } from '@nestjs/common';
import { QualityService } from './quality.service';

@Module({
  providers: [QualityService],
  exports: [QualityService],
})
export class QualityModule {}
