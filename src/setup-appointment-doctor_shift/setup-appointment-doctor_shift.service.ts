/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, DefaultNamingStrategy, createConnection } from 'typeorm';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupAppointmentDoctorShiftService {
  constructor(
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService,
  ) {}
 
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
 
    const [Hos_staff_email] = await this.connection.query(`select email from staff where id = ?`,[doctor_shiftEntity.staff_id])
   
    const [Admin_staff_id] = await dynamicConnection.query(`select id from staff where email = ?`,[Hos_staff_email.email])
 
    const [Admin_global_shift_id] = await dynamicConnection.query(`select id from global_shift where Hospital_id = ? and hospital_global_shift_id = ?`,[doctor_shiftEntity.Hospital_id,doctor_shiftEntity.global_shift_id])
 
 
    const [check] = await this.connection.query(`select id from doctor_global_shift where staff_id = ? and global_shift_id = ?`,[doctor_shiftEntity.staff_id,doctor_shiftEntity.global_shift_id])
   try {
    if (check) {
 
      const delHos = await this.connection.query(`delete from doctor_global_shift where id = ?`,[check.id])
     
      const delAdm = await dynamicConnection.query(`delete from doctor_global_shift where Hospital_id = ? and hospital_doctor_global_shift_id = ?`,[doctor_shiftEntity.Hospital_id,check.id])
     
      console.log("dddd",delHos);
      console.log("ffff",delAdm);
      if (dynamicConnection) {
        dynamicConnection.close();
      }
     
      return [{"data ":{
        "status":"success",
        "messege":"doctor_global_shift details deleted successfully ",
        }}]
     
          } else {
     
      const newHos = await this.connection.query(`insert into doctor_global_shift (staff_id,global_shift_id) values (?,?)`,
      [
        doctor_shiftEntity.staff_id,
        doctor_shiftEntity.global_shift_id
      ])
     
      const newAdmin = await dynamicConnection.query(`insert into doctor_global_shift (staff_id,global_shift_id,Hospital_id,hospital_doctor_global_shift_id)
      values (?,?,?,?)`,
      [
        Admin_staff_id.id ,
        Admin_global_shift_id.id,
        doctor_shiftEntity.Hospital_id,
        newHos.insertId
      ])
     
      console.log("lllll",newHos);
      console.log("ooooooo",newAdmin);
      if (dynamicConnection) {
        dynamicConnection.close();
      }
     
      return [{"data ":{
        "status":"success",
        "messege":"doctor_global_shift details added successfully ",
        }}]
          }
   } catch (error) {
    console.log(error);
   
   }
 
 
 
   
  }
 
 
catch(error){
  if (dynamicConnection) {
    dynamicConnection.close();
  }
  console.log(error);
 
} }
 
 
 
  async findAll(): Promise<SetupAppointmentDoctorShift[]> {
      const doctor_shift = await this.connection.query(`SELECT
      staff.id,
      CONCAT(staff.name, ' ', staff.surname, '(', staff.employee_id, ')') AS doctor_name,
      JSON_ARRAYAGG(
          JSON_OBJECT('shift', global_shift.name,'id',global_shift.id)
      ) AS global_shifts
  FROM
      staff
  LEFT JOIN
      doctor_global_shift ON doctor_global_shift.staff_id = staff.id
  LEFT JOIN
      global_shift ON global_shift.id = doctor_global_shift.global_shift_id
  GROUP BY
      staff.id,
      CONCAT(staff.name, ' ', staff.surname, '(', staff.employee_id, ')');
  `);
    return doctor_shift;
    // const globalShifts = []
  }
 
 
 
 
 
 
 
 
 
}