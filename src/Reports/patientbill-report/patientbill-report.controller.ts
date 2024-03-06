import { Controller, Get, Param } from '@nestjs/common';
import { PatientBillReport } from './patientbill-report.service';

@Controller('patient_bill_report')
export class PatientBillReportController {
  constructor(private readonly patientBillReportService: PatientBillReport) {}

  @Get(':case_reference_id') 
  async findOne(@Param('case_reference_id') caseReferenceId: number) {
    console.log("billings");
    return await this.patientBillReportService.findPatientBillReport(caseReferenceId);
  }
}
