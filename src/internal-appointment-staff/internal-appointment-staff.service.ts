import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InternalAppointmentStaff } from './entities/internal-appointment-staff.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';


@Injectable()
export class InternalAppointmentStaffService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

 async findAll() {
  const staff = await this.connection.query(` SELECT distinct CONCAT( staff.name, ' ', staff.surname," (",(staff.employee_id),")")  doctor,staff.id from staff
  left join staff_roles on staff_roles.staff_id = staff.id 
  where staff_roles.role_id = 3`)
return staff;
}
  

  


  
}
