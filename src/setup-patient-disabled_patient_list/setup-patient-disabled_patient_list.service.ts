/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { SetupPatientDisabledPatientList } from './entities/setup-patient-disabled_patient_list.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
 
@Injectable()
export class SetupPatientDisabledPatientListService {
 
  constructor(@InjectConnection() private connection: Connection) {}
 
  async findAll(): Promise<SetupPatientDisabledPatientList[]> {
    const patients = await this.connection.query('select patients.id, patients.patient_name,concat(patients.age,"year",patients.month,"month",patients.day,"day") AS dob,patients.gender,patients.mobileno,patients.guardian_name,patients.address,patients.is_dead,patients.insurance_id,patients.insurance_validity from patients where is_active = ?', ['no']);
    console.log(patients,'patttt');
    
    return patients ;
  }
  async update(id:number,data:any):Promise<any>{
    const { is_active, ...otherData } = data; // Extract is_active from data
   console.log(otherData,is_active,"dd");
   
    const updateQuery = `UPDATE patients
                         SET is_active = ?,  
                             ${Object.keys(otherData).map(key => `${key} = ?`).join(', ')}
                         WHERE id = ?`;
 
    const updateValues = [is_active, ...Object.values(otherData), id];  
    const result = await this.connection.query(updateQuery, updateValues);
    return result;
  }
}
 