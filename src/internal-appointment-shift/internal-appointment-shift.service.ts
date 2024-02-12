import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';

@Injectable()
export class InternalAppointmentShiftService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async findAll(staff_id:number) {
    const charges = await this.connection.query(`select global_shift.name shift_name,global_shift.id global_shift_id,
    doctor_global_shift.staff_id staff_id from global_shift left join doctor_global_shift on doctor_global_shift.global_shift_id = global_shift.id
     where staff_id = ?`,[staff_id])
  return charges;
  }}
