// src/uploadcare/uploadcare.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UploadcareService } from './uploadcare.service';

@Controller('uploadcare')
export class UploadcareController {
  constructor(private readonly uploadcare: UploadcareService) {}

  // GET /uploadcare/buckets → lista los buckets simulados
  @Get('buckets')
  async getBuckets() {
    return this.uploadcare.listBuckets();
  }

  // GET /uploadcare/buckets/:bucket → lista archivos dentro del bucket
  @Get('buckets/:bucket')
  async getBucketFiles(@Param('bucket') bucket: string) {
    return this.uploadcare.listFilesByBucket(bucket);
  }

  // POST /uploadcare/buckets/assign → asignar bucket a un archivo
  @Post('buckets/assign')
  async assignBucket(
    @Body('uuid') uuid: string,
    @Body('bucket') bucket: string,
  ) {
    return this.uploadcare.assignBucket(uuid, bucket);
  }
}
