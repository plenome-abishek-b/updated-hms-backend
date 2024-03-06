import { Controller, Get, Param } from '@nestjs/common';
import { PatientVisitReportService } from './patientvisit-report.service';

@Controller('patient-visit-report')
export class PatientVisitReportController {
    constructor(private readonly patientVisitReportService: PatientVisitReportService) {}

    @Get(':patientId') 
    async findOne(@Param('patientId') patientId: number) {
        try {
            const visitReport = await this.patientVisitReportService.getPatientVisitReport(patientId);
            return visitReport;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}