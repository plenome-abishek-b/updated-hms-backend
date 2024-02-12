import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';
@Injectable()
export class InternalAppointmentChargesService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

 async findAll(staff_id:number) {
  const charges = await this.connection.query(`select shift_details.staff_id, charges.id charge_id, round((charges.standard_charge+(charges.standard_charge*((tax_category.percentage)/100))),2) amount from
  charges left join tax_category on charges.tax_category_id = tax_category.id 
  left join shift_details on shift_details.charge_id = charges.id
where shift_details.staff_id = ?`,[staff_id])
return charges;
}
}
