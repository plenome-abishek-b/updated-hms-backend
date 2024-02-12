import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddAppointmentPatientQueueService } from './add-appointment-patient_queue.service';

@Controller('add-appointment-patient-queue')
export class AddAppointmentPatientQueueController {
  constructor(private readonly addAppointmentPatientQueueService: AddAppointmentPatientQueueService) {}


  @Get()
  findAll(@Query('doctor')doctor:number,@Query('date')date:string,@Query('global_shift_id')global_shift_id:number,@Query('doctor_shift_id')doctor_shift_id:number) {
    return this.addAppointmentPatientQueueService.findall(doctor,date,global_shift_id,doctor_shift_id);
  }


}
