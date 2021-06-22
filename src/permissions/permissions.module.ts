import { Module } from '@nestjs/common';
import { RolesModule } from 'src/roles/roles.module';
import { SchemasModule } from 'src/schemas/schemas.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
  imports: [SchemasModule, RolesModule],
})
export class PermissionsModule {}
