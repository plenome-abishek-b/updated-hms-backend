import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalAppointmentShiftService } from './internal-appointment-shift.service';

@Controller('internal-appointment-shift')
export class InternalAppointmentShiftController {
  constructor(private readonly internalAppointmentShiftService: InternalAppointmentShiftService) {}

 

  @Get(':id')
  findAll(@Param('id')id) {
    return this.internalAppointmentShiftService.findAll(id);
  }

 
  
}
