import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalAppointmentStaffService } from './internal-appointment-staff.service';

@Controller('internal-appointment-staff')
export class InternalAppointmentStaffController {
  constructor(private readonly internalAppointmentStaffService: InternalAppointmentStaffService) {}

 

  @Get()
  findAll() {
    return this.internalAppointmentStaffService.findAll();
  }



  

  
}
