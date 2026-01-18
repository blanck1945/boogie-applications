// src/application-access/application-access.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationAccessService } from './application-access.service';
import { UpdateApplicationAccessDto } from './dto/update-application-access.dto';
import { CreateApplicationAccessDto } from './dto/create-application-access.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('applications-access')
export class ApplicationAccessController {
  constructor(private readonly service: ApplicationAccessService) {}

  // GET /applications-access/app/:appId
  @Get('app/:appId')
  list(@Param('appId', ParseUUIDPipe) appId: string) {
    return this.service.listByApplication(appId);
  }

  @Post('app/:appId')
  @UseGuards(AuthGuard)
  create(
    @Req() req: Request,
    @Param('appId', ParseUUIDPipe) appId: string,
    @Body() dto: CreateApplicationAccessDto,
  ) {
    const user = (req as any).user;
    const userId = user?.id ? String(user.id) : undefined;
    console.warn('userId', userId);
    return this.service.upsert(appId, { ...dto, userId });
  }

  // PATCH /applications-access/app/:appId/access/:accessId
  @Patch('app/:appId/access')
  update(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('accessId', ParseUUIDPipe) accessId: string,
    @Body() dto: UpdateApplicationAccessDto,
  ) {
    return this.service.update(appId, accessId, dto);
  }

  // DELETE /applications-access/app/:appId/access/:accessId
  @Delete('app/:appId/access/:accessId')
  remove(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('accessId', ParseUUIDPipe) accessId: string,
  ) {
    return this.service.remove(appId, accessId);
  }
}
