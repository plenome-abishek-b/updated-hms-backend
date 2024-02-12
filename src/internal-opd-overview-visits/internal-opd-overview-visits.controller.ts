import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalOpdOverviewVisitsService } from './internal-opd-overview-visits.service';
@Controller('internal-opd-overview-visits')
export class InternalOpdOverviewVisitsController {
  constructor(private readonly internalOpdOverviewVisitsService: InternalOpdOverviewVisitsService) {}

 

  @Get()
  findAll(@Query('patient_id')patient_id:number) {
    return this.internalOpdOverviewVisitsService.findAll(patient_id);
  }



  

 
}
