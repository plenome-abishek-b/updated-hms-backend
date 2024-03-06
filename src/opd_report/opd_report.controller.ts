import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OpdReportService } from './opd_report.service';
import { OpdReport } from './entities/opd_report.entity';

@Controller('opd-report')
export class OpdReportController {
  constructor(private readonly opdReportService: OpdReportService) {}



  @Get()
  async getOpdReport(@Query() filters: any) {
    try {
      const opdReport = await this.opdReportService.getOpdReport(filters);
      return opdReport;
    } catch (error) {
      console.error(error);
    }
  }





}
