import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AddAppointmentPatientQueueService {
  constructor(@InjectConnection() private connection: Connection  ){} 

  async findall(doctor:number,date:string,global_shift_id:number,doctor_shift:number){
    let q = `  select distinct appointment.id, concat(patients.patient_name,"(",patients.id,")") as patient_name,patients.mobileno as phone ,appointment.time,patients.email,
    appointment.date,appointment.source from appointment
        left join patients on appointment.patient_id = patients.id
            left join staff on  appointment.doctor = staff.id 
        left join doctor_shift on doctor_shift.staff_id = staff.id
        left join doctor_global_shift on doctor_global_shift.staff_id = staff.id
            where doctor = 4 and date( appointment.date )= '2024-01-25' and appointment.global_shift_id = 1 and doctor_shift.id = 1`
    let v = [doctor,date,global_shift_id,doctor_shift]
    const patient_queue = await this.connection.query(q,v)
    return patient_queue
  }


}
