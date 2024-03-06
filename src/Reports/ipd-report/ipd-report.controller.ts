

import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { IpdReportService } from './ipd-report.service';

@Controller('ipd-report')
export class IpdReportController {
  constructor(private readonly ipdReportService: IpdReportService) {}

  @Get()
  async getIpdReport(@Query() filters: any) {
    try {
      const ipdReport = await this.ipdReportService.getIpdReport(filters);
      return ipdReport;
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
