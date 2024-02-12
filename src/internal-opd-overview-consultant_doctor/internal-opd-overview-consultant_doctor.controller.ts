import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalOpdOverviewConsultantDoctorService } from './internal-opd-overview-consultant_doctor.service';

@Controller('internal-opd-overview-consultant-doctor')
export class InternalOpdOverviewConsultantDoctorController {
  constructor(private readonly internalOpdOverviewConsultantDoctorService: InternalOpdOverviewConsultantDoctorService) {}



  @Get()
  findAll(@Query('patient_id')patient_id:number) {
    return this.internalOpdOverviewConsultantDoctorService.findAll(patient_id);
  }

  

 

 
}
