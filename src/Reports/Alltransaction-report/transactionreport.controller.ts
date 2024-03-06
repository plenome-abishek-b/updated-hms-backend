import { Controller, Get, Query } from '@nestjs/common';
import { TransactionReportService } from './transactionreport.service';


@Controller('transaction_report')
export class transaction_Report_Controller {
  constructor(private readonly transactionReportService: TransactionReportService) {}

  @Get()
  async getincomeReport(
    @Query('timeDuration') timeDuration: string,
    @Query('collectedBy') collectedBy: number,
    @Query('head') head: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const transactionReport = await this.transactionReportService.getTransactionReport(
      timeDuration,
      collectedBy,
      head,
      fromDate,
      toDate,
    );
    return transactionReport;
  }
}
