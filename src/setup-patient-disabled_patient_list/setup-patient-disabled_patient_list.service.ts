import { Injectable } from '@nestjs/common';
import { SetupPatientDisabledPatientList } from './entities/setup-patient-disabled_patient_list.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class SetupPatientDisabledPatientListService {
  
  constructor(@InjectConnection() private connection: Connection) {}

  async findAll(): Promise<SetupPatientDisabledPatientList[]> {
    const patients = await this.connection.query('select patients.id, patients.patient_name,concat(patients.age," year ",patients.month," month ",patients.day, " day ") AS dob,patients.gender,patients.mobileno,patients.guardian_name,patients.address,patients.is_dead,patients.insurance_id,patients.insurance_validity,patients.ABHA_number from patients where is_active = ?', ['no']);
    return patients ;
  }
}
