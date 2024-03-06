import { Module } from '@nestjs/common';
import { OpdBalanceReportService } from './opd_balance_report.service';
import { OpdBalanceReportController } from './opd_balance_report.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  controllers: [OpdBalanceReportController],
  providers: [OpdBalanceReportService,DynamicDatabaseService],
})
export class OpdBalanceReportModule {}
