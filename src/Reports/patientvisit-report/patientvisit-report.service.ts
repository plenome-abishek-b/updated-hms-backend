import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PatientVisitReportService {
    constructor(@InjectConnection() private connection: Connection) {}

    async getPatientVisitReport(patientId: number) {
        try {
            const visitReport = await this.connection.query('CALL patientVisitReport(?)', [patientId]);
            return visitReport; 
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}