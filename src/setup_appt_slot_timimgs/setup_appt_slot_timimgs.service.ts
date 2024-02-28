import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SetupApptSlotTimimg } from './entities/setup_appt_slot_timimg.entity';
import { Connection, createConnection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Injectable()
export class SetupApptSlotTimimgsService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
async  create(timingEntity: SetupApptSlotTimimg): Promise<{[key: string]: any}[]> {
  let dynamicConnection;
try {
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
  const dynamicConnection = await createConnection(dynamicConnectionOptions)
  console.log("aaa",  timingEntity.hospital_id,
  timingEntity.global_shift_id);
    const [getAdminGlobal] = await dynamicConnection.query(`select id from global_shift where
    Hospital_id = ? and hospital_global_shift_id = ? `,[
      timingEntity.hospital_id,
      timingEntity.global_shift_id
    ])
    console.log(getAdminGlobal,"1");
    
 
  
    const [getHosDocmail] = await this.connection.query(`select email from staff where id = ?`,[timingEntity.staff_id])

    const [getAdminDoc_id] = await dynamicConnection.query(`select id from staff where email = ?`,[getHosDocmail.email])
      const insert = await this.connection.query(` insert into doctor_shift (
        day,
        staff_id,
        global_shift_id,
        start_time,
        end_time) values (?,?,?,?,?)`,[
          timingEntity.day,
          timingEntity.staff_id,
          timingEntity.global_shift_id,
          timingEntity.start_time,
          timingEntity.end_time
        ])

  
    const insertAdmin = await dynamicConnection.query(` insert into doctor_shift (
      day,
      staff_id,
      global_shift_id,
      start_time,
      end_time,Hospital_id,
      hospital_doctor_shift_id) values (?,?,?,?,?,?,?)`,[
        timingEntity.day,
        getAdminDoc_id.id,
        getAdminGlobal.id,
        timingEntity.start_time,
        timingEntity.end_time,
        timingEntity.hospital_id,
        insert.insertId
      ])
    return [{
      "data ":
      {
         "id  ":insert.insertId,
              "status":"success",
              "messege":"doctor_shift details added successfully ",
               "inserted_data": await this.connection.query('SELECT * FROM doctor_shift WHERE id = ?', [insert.insertId])
              }}];

}catch(error){
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }}

   


    // return "inserted id : "+insert.insertId;
    
  }

  async  finforDocAndShift(day:string,staff_id:number,global_shift_id:number) {
    const slot_timings = await this.connection.query(`select doctor_shift.id,doctor_shift.start_time,doctor_shift.end_time ,doctor_shift.day
     from doctor_shift where day = ? and staff_id = ? and global_shift_id = ?`,[
      day,staff_id,global_shift_id
     ])
      return slot_timings;
    }



async  update(id: number, timingEntity: SetupApptSlotTimimg):Promise<{ [key:string]: any}[]> {
    const update = await this.connection.query('update doctor_shift set start_time = ?, end_time = ? where id = ?',[
      timingEntity.start_time,
      timingEntity.end_time,id
    ])

    return  [{"data ":{
      status:"success",
      "message":"doctor_shift details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM doctor_shift WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update doctor_shift module",
  }
  ]
}
  

async  remove(id: number) {
    const del = await this.connection.query('delete from doctor_shift where id = ?',[id]);
    // return `This action removes a #${id} setupApptSlotTimimg`;

    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
