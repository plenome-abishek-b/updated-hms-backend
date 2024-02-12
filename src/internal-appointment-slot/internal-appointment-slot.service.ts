import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';
@Injectable()
export class InternalAppointmentSlotService {
 
  constructor(@InjectConnection() private connection: Connection  ){} 

  async findAll(staff_id:number,global_shift_id:number,date:string) {
    const charges = await this.connection.query(`select doctor_shift.id shift_id,doctor_shift.staff_id,doctor_shift.global_shift_id,doctor_shift.day,
    concat(start_time," - ",end_time) slot
     from doctor_shift where staff_id = ? 
    and global_shift_id = ? and day = dayname(?)`,[staff_id,global_shift_id,date])
  return charges;

}}
