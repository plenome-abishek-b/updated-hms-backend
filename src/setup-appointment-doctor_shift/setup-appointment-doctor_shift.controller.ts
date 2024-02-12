import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SetupAppointmentDoctorShiftService } from './setup-appointment-doctor_shift.service';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
@Controller('setup-appointment-doctor-shift')
export class SetupAppointmentDoctorShiftController {
  constructor(private readonly setupAppointmentDoctorShiftService: SetupAppointmentDoctorShiftService) {}

  @Post()
  create(@Body() doctor_shiftEntity: SetupAppointmentDoctorShift) {
    return this.setupAppointmentDoctorShiftService.create(doctor_shiftEntity);
  }

  @Get()
  findAll() {
    return this.setupAppointmentDoctorShiftService.findAll();
  }



}
