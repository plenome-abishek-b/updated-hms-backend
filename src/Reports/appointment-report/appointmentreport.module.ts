
import { Module } from '@nestjs/common';
import { appointment_Report_Controller } from './appointmentreport.controller';
import { AppointmentReportService } from './appointmentreport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentReport } from './appointmentreport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentReport])],
  controllers: [appointment_Report_Controller],
  providers: [AppointmentReportService],
})
export class Appointment_ReportModule {}
