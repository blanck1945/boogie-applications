import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationAccess } from './entity/application-access.entity';
import { Application } from '../application/entity/application.entity';
import { ApplicationAccessService } from './application-access.service';
import { ApplicationAccessGuard } from './guards/application-access.guard';
import { ApplicationAccessController } from './application-access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationAccess, Application])],
  controllers: [ApplicationAccessController],
  providers: [ApplicationAccessService, ApplicationAccessGuard],
  exports: [ApplicationAccessService, ApplicationAccessGuard],
})
export class ApplicationAccessModule {}
