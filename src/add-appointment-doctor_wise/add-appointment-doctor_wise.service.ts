import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AddAppointmentDoctorWiseService {
  constructor(@InjectConnection() private connection: Connection  ){} 

  async findall(doctor:number,date:string) {
    console.log("1",doctor)

    console.log("2",date)
    let q = `select distinct appointment.id,appointment.doctor, concat(patients.patient_name,"(",patients.id,")") as patient_name,patients.mobileno as phone ,appointment.time,patients.email,
    appointment.date,appointment.source from appointment
    left join patients on appointment.patient_id = patients.id
    left join staff on  appointment.doctor = staff.id 
    where doctor = ? and date( appointment.date )= ?`
    let v= [doctor,date]
    const doctor_wise = await this.connection.query(q,v)
    console.log(q,"3",v);
    
    return doctor_wise 
  }
}
