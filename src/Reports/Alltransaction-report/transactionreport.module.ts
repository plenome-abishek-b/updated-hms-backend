
import { Module } from '@nestjs/common';
import { transaction_Report_Controller } from './transactionreport.controller';
import { TransactionReportService } from './transactionreport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { transactions_report } from './transactionreport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([transactions_report])],
  controllers: [transaction_Report_Controller],
  providers: [TransactionReportService],
})
export class transaction_ReportModule {}
