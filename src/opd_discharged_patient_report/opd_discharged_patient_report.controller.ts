import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OpdDischargedPatientReportService } from './opd_discharged_patient_report.service';
import { OpdDischargedPatientReport } from './entities/opd_discharged_patient_report.entity';


@Controller('opd-discharged-patient-report')
export class OpdDischargedPatientReportController {
  constructor(private readonly opdDischargedPatientReportService: OpdDischargedPatientReportService) {}


  @Get()
  async getOpdDischargePatientReport(@Query() filters: any) {
    try {
      const opdDischargeReport = await this.opdDischargedPatientReportService.getOpdDischargePatientReport(filters);
      return opdDischargeReport;
    } catch (error) {
      console.error(error);
    }
  }


}
