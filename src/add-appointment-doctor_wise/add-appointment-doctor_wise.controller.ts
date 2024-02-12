import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddAppointmentDoctorWiseService } from './add-appointment-doctor_wise.service';

@Controller('add-appointment-doctor-wise')
export class AddAppointmentDoctorWiseController {
  constructor(private readonly addAppointmentDoctorWiseService: AddAppointmentDoctorWiseService) {}


  @Get()
  findAll(@Query('doctor')doctor:number,@Query('date')date:string) {
    return this.addAppointmentDoctorWiseService.findall(doctor,date);
  }

  
}
