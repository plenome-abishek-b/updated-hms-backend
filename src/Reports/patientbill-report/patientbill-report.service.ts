import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class PatientBillReport {
  constructor(private readonly connection: Connection) {}

  async findPatientBillReport(caseReferenceId: number) {
    try {
      const billReport = await this.connection.query('CALL patientBillReport(?)', [caseReferenceId]);
      return billReport; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
