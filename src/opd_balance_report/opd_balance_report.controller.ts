import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OpdBalanceReportService } from './opd_balance_report.service';
import { OpdBalanceReport } from './entities/opd_balance_report.entity';


@Controller('opd-balance-report')
export class OpdBalanceReportController {
  constructor(private readonly opdBalanceReportService: OpdBalanceReportService) {}



  @Get()
  async getOpdBalanceReport(@Query() filters: any) {
    try {
      const opdBalanceReport = await this.opdBalanceReportService.getOpdBalanceReport(filters);
      return opdBalanceReport;
    } catch (error) {
      console.error(error);
    }
  }


}
