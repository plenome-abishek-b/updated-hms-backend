import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalAppointmentPriorityService } from './internal-appointment-priority.service';

@Controller('internal-appointment-priority')
export class InternalAppointmentPriorityController {
  constructor(private readonly internalAppointmentPriorityService: InternalAppointmentPriorityService) {}

 

  @Get()
  findAll() {
    return this.internalAppointmentPriorityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internalAppointmentPriorityService.findOne(id);
  }

  

}
