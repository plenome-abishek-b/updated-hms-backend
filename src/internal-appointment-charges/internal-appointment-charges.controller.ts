import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalAppointmentChargesService } from './internal-appointment-charges.service';

@Controller('internal-appointment-charges')
export class InternalAppointmentChargesController {
  constructor(private readonly internalAppointmentChargesService: InternalAppointmentChargesService) {}

 

  @Get(':id')
  findAll(@Param('id')id) {
    return this.internalAppointmentChargesService.findAll(id);
  }

  

}
