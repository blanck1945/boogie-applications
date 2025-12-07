// src/uploadcare/uploadcare.module.ts
import { Module } from '@nestjs/common';
import { UploadcareService } from './uploadcare.service';
import { UploadcareController } from './uploadcare.controller';

@Module({
  providers: [UploadcareService],
  controllers: [UploadcareController],
})
export class UploadcareModule {}
