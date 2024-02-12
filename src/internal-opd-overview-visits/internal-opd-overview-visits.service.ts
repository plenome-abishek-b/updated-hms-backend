import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Injectable()
export class InternalOpdOverviewVisitsService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}

  async findAll(patient_id:number) {
    const visits = await this.connection.query(`  select CONCAT('OPDN', visit_details.opd_details_id) as opd_NO,opd_details.case_reference_id AS CASE_ID,visit_details.appointment_date,
    CONCAT(staff.name, ' ', staff.surname, staff.employee_id)  AS consultant,visit_details.refference,visit_details.symptoms from visit_details
    join opd_details ON visit_details.opd_details_id = opd_details.id
    join staff ON visit_details.cons_doctor = staff.id where patient_id = ?`,[patient_id])
    return visits;
  }

  


}
