import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientbillReport } from './patientbill-report.entity';
import { PatientBillReportController } from './patientbill-report.controller';
import { PatientBillReport } from './patientbill-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientbillReport])],
  controllers: [PatientBillReportController],
  providers: [PatientBillReport],
})
export class PatientBillReportModule {}
