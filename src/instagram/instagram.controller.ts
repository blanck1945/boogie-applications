// src/instagram/instagram.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Post('preview')
  previewPost(@Body('postUrl') postUrl: string) {
    return this.instagramService.previewPost(postUrl);
  }

  @Get('stats/:mediaId')
  getStats(@Param('mediaId') mediaId: string) {
    console.warn('USANDO ESTO');
    return this.instagramService.getStats(mediaId);
  }
}
