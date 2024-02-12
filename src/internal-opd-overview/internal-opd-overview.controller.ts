import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalOpdOverviewService } from './internal-opd-overview.service';

@Controller('internal-opd-overview')
export class InternalOpdOverviewController {
  constructor(private readonly internalOpdOverviewService: InternalOpdOverviewService) {}

  
  @Get()
  findAll(@Query('patient_id')patient_id:number) {
    return this.internalOpdOverviewService.findALL(patient_id);
  }

 


 
}
