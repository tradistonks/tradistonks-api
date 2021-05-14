import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
  imports: [SchemasModule],
})
export class RefreshTokensModule {}
