import { Controller, Get, Param } from '@nestjs/common';
import { IncomeSummary } from './entities/overallincome.entity';
import { IncomeSummaryService } from './overallincome.service';

@Controller('income-summary')
export class IncomeSummaryController {
  constructor(private readonly incomeSummaryService: IncomeSummaryService) {}

  @Get('overall')
  async getOverallIncomeAndExpense(): Promise<IncomeSummary> {
    return this.incomeSummaryService.getOverallIncomeAndExpense();
  }

  @Get('yearly-income')
  async getYearlyIncomeByCategory(): Promise<any[]> {
    return this.incomeSummaryService.getYearlyIncomeByCategory();
  }

  @Get('yearly-percentage')
  async getYearlyIncomeByPercentage(): Promise<any[]> {
    return this.incomeSummaryService.getYearlyIncomeByPercentage();
  }
 
}
