import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentReportService } from './appointmentreport.service';


@Controller('appointment_report')
export class appointment_Report_Controller {
  constructor(private readonly transactionReportService: AppointmentReportService) {}

  @Get()
  async getincomeReport(
    @Query('timeDuration') timeDuration: string,
    @Query('doctor') doctor: number,
    @Query('shift') shift: number,
    @Query('priority') priority: number,
    @Query('source') source: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    const incomeReport = await this.transactionReportService.getAppointmentReport(
      timeDuration,
      doctor,
      shift,
      priority,
      source,
      fromDate,
      toDate,
    );
    return incomeReport;
  }
}



