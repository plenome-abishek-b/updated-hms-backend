import { Module } from '@nestjs/common';
import { OpdDischargedPatientReportService } from './opd_discharged_patient_report.service';
import { OpdDischargedPatientReportController } from './opd_discharged_patient_report.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  controllers: [OpdDischargedPatientReportController],
  providers: [OpdDischargedPatientReportService,DynamicDatabaseService],
})
export class OpdDischargedPatientReportModule {}
