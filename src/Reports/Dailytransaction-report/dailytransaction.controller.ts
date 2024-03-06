import { Controller, Get, Query } from '@nestjs/common';
import { DailyTransactionReportService } from './dailytransaction.service';

@Controller('daily-transaction-report')
export class DailyTransactionReportController {
  constructor(private readonly dailyTransactionReportService: DailyTransactionReportService) {}

  @Get()
  async getDailyTransactionReport(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const dailyTransactionReport = await this.dailyTransactionReportService.getReport(fromDate, toDate);
    return dailyTransactionReport;
  }
}


