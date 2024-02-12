import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalAppointmentSlotService } from './internal-appointment-slot.service';
@Controller('internal-appointment-slot')
export class InternalAppointmentSlotController {
  constructor(private readonly internalAppointmentSlotService: InternalAppointmentSlotService) {}

 

  @Get()
  findAll(@Query('staff_id')staff_id ,@Query('global_shift_id')global_shift_id,@Query('date')date) {
    return this.internalAppointmentSlotService.findAll(staff_id,global_shift_id,date);
  }

 

}
