import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientVisitReportController } from './patientvisit-report.controller';
import { PatientVisitReportService } from './patientvisit-report.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [PatientVisitReportController],
  providers: [PatientVisitReportService],
})
export class PatientvisitReportModule {}
