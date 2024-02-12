import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, DefaultNamingStrategy, createConnection } from 'typeorm';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupAppointmentDoctorShiftService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(doctor_shiftEntity: SetupAppointmentDoctorShift ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);

     const [staffEmail] = await this.connection.query(`select email from staff where id = ?`,[doctor_shiftEntity.staff_id])
     const [staff_email]  = await dynamicConnection.query(`select id from staff where email = ?`,
     [
      staffEmail.email
    ])
    const [doctor_global_shift] = await dynamicConnection.query(`select id from global_shift where Hospital_id = ? and hospital_global_shift_id = ?`,
    [
     doctor_shiftEntity.Hospital_id,
     doctor_shiftEntity.global_shift_id
    ])

const [check] = await this.connection.query(`select id from doctor_global_shift where staff_id = ? and global_shift_id = ? `,[
  doctor_shiftEntity.staff_id,doctor_shiftEntity.global_shift_id
])
if(check){
  const [GetAdmin] = await dynamicConnection.query(`select id from doctor_global_shift where Hospital_id = ? and hospital_doctor_global_shift_id = ? `,[
    doctor_shiftEntity.Hospital_id,check.id

  ]) 
  const delAdmin = await dynamicConnection.query(`delete from doctor_global_shift where id = ?`,[GetAdmin.id])
const del = await this.connection.query(`delete from doctor_global_shift where id = ?`,[check.id])
return [{"data ":{
"status":"success",
"messege":"doctor_global_shift details deleted successfully ",
}}]
}
else{
  const result = await this.connection.query(
    'INSERT INTO doctor_global_shift (staff_id,global_shift_id) VALUES (?,?)',
    [
      doctor_shiftEntity.staff_id,
      doctor_shiftEntity.global_shift_id,  
    ]
  );
    const AdminCategory = await dynamicConnection.query(`INSERT INTO doctor_global_shift (staff_id,global_shift_id,Hospital_id,hospital_doctor_global_shift_id) VALUES (?,?,?,?)`,[
       staff_email.id,
      doctor_global_shift.id,
      doctor_shiftEntity.Hospital_id,
      result.insertId

    ])
    console.log("entering if",AdminCategory);
  
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"doctor_global_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM doctor_global_shift WHERE id = ?', [result.insertId])
              }}];

            }
  } catch (error) {
    if(dynamicConnection){
    await dynamicConnection.close();
return error
  }}
  }



  async findAll(): Promise<SetupAppointmentDoctorShift[]> {
    const doctor_shift = await this.connection.query(`select staff.id, CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,global_shift.name as global_shift from staff
    left join doctor_global_shift on doctor_global_shift.staff_id = staff.id
    left join global_shift on global_shift.id = doctor_global_shift.global_shift_id`)
    return doctor_shift ;
  }

  
  






}
