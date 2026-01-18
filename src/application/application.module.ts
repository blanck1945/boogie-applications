import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entity/application.entity';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ApplicationAccessModule } from 'src/application-access/application-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), ApplicationAccessModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
