import { Module } from '@nestjs/common';
import { OpdReportService } from './opd_report.service';
import { OpdReportController } from './opd_report.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  controllers: [OpdReportController],
  providers: [OpdReportService,DynamicDatabaseService],
})
export class OpdReportModule {}
