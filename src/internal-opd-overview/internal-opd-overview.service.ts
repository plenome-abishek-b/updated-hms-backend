import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';

@Injectable()
export class InternalOpdOverviewService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async findALL(patient_id:number) {
    const overview = await this.connection.query(` select distinct concat(patients.patient_name," ","(",patients.id,")") as name,patients.gender,concat(patients.age,"year"," " ,patients.month,"months"," " , patients.day,"days") as age, 
    patients.guardian_name,patients.mobileno as phone ,patients.known_allergies, visit_details.symptoms from visit_details
    join opd_details ON visit_details.opd_details_id = opd_details.id   
     join patients ON patients.id = opd_details.patient_id where patients.id = ?`,[patient_id])
     return overview;
  }

 

 

 
}
