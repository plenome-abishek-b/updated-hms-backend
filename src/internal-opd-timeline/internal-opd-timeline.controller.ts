import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalOpdTimelineService } from './internal-opd-timeline.service';
import { InternalOpdTimeline } from './entities/internal-opd-timeline.entity';

@Controller('internal-opd-timeline')
export class InternalOpdTimelineController {
  constructor(private readonly internalOpdTimelineService: InternalOpdTimelineService) {}

  @Post()
  create(@Body() opd_timeline:InternalOpdTimeline) {
    return this.internalOpdTimelineService.create(opd_timeline);
  }

  @Get()
  findAll(@Query('patient_id')patient_id:number) {
    return this.internalOpdTimelineService.findAll(patient_id);
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() opd_timeline:InternalOpdTimeline ) {
    return this.internalOpdTimelineService.update(id,opd_timeline );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internalOpdTimelineService.remove(id);
  }
}
