import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBedBedStatusService } from './setup-bed-bed_status.service';


@Controller('setup-bed-bed-status')
export class SetupBedBedStatusController {
  constructor(private readonly setupBedBedStatusService: SetupBedBedStatusService) {}

 

  @Get()
  findAll() {
    return this.setupBedBedStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBedBedStatusService.findOne(id);
  }

 
}
