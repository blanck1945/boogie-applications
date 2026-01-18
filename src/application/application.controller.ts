import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from './entity/application.entity';
import { ApplicationAccessGuard } from 'src/application-access/guards/application-access.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @Req() req: Request,
    @Query('sortBy') sortBy?: 'id' | 'name' | 'createdAt',
  ) {
    const user = (req as any).user;
    const userId = user?.id ? String(user.id) : null;

    return this.applicationService.findVisibleForUser(userId, sortBy);
  }

  @UseGuards(AuthGuard)
  @Get('admin/my-applications')
  async getMyApplications(
    @Req() req: any,
    @Query('sortBy') sortBy?: 'id' | 'name' | 'createdAt',
  ) {
    // Extraemos el sub (ID) que el Guard puso en el request
    const ownerId = req.user.id;
    return this.applicationService.findAllByOwner(ownerId, sortBy);
  }

  @Get(':id')
  // @UseGuards(ApplicationAccessGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Application | null> {
    return this.applicationService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: Request,
    @Body() body: Partial<Application>,
  ): Promise<Application> {
    const user = (req as any).user;
    const userId = user?.id ? String(user.id) : undefined;
    console.warn('user', user);
    console.warn('userId', userId);
    return this.applicationService.create({ ...body, ownerId: userId });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: Partial<Application>,
  ): Promise<Application> {
    return this.applicationService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.applicationService.remove(id);
  }
}
