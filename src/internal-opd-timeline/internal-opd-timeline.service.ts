import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { InternalOpdTimeline } from './entities/internal-opd-timeline.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class InternalOpdTimelineService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

 async create(opd_timeline:InternalOpdTimeline) {
  let dynamicConnection
  try{
    const result = await this.connection.query('insert into patient_timeline (patient_id,title,timeline_date,description,document,status,date,generated_users_type) values (?,?,?,?,?,?,?,?)',
    [
      opd_timeline.patient_id,
      opd_timeline.title,
      opd_timeline.timeline_date,
      opd_timeline.description,
      opd_timeline.document,
      opd_timeline.status,
      opd_timeline.date,
      opd_timeline.generated_users_type,
    ]);
  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
 

   const AdminCategory = await dynamicConnection.query(`insert into patient_timeline (patient_id,title,timeline_date,description,document,status,date,generated_users_type,hospital_id,hospital_patient_timeline_id) values (?,?,?,?,?,?,?,?,?,?)`,[
    opd_timeline.patient_id,
    opd_timeline.title,
    opd_timeline.timeline_date,
    opd_timeline.description,
    opd_timeline.document,
    opd_timeline.status,
    opd_timeline.date,
    opd_timeline.generated_users_type,
    opd_timeline.hospital_id,
    result.insertId
   ])

   console.log("entering if",AdminCategory);
   await dynamicConnection.close();
 
   return [{"data":{"id ":result.insertId,
   "status":"success",
   "messege":"patient_timeline details added successfully inserted",
   "inserted_data": await this.connection.query('SELECT * FROM patient_timeline WHERE id = ?', [result.insertId])
   }}];
 } catch (error) {
   if(dynamicConnection){
     await dynamicConnection.close();
     return error
   }
 }
 }
  
  async findAll(patient_id:number) {
    const opd_timeline = await this.connection.query(`SELECT patient_timeline.id,patient_timeline.patient_id,patient_timeline.title,patient_timeline.timeline_date,
    patient_timeline.description,patient_timeline.document from patient_timeline
    where patient_id = ?`,[patient_id])
    return opd_timeline;
  }

 async update (id:string, opd_timeline:InternalOpdTimeline) {
  let dynamicConnection;
  try{

    const result = await this.connection.query(
      `update patient_timeline SET title = ?, timeline_date = ?, description =?, document= ?, status= ? where id = ?`,
      [
        opd_timeline.title,
        opd_timeline.timeline_date,
        opd_timeline.description,
        opd_timeline.document,
        opd_timeline.status,
        id
      ]
    )
  
    console.log("ddddd");

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
    )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    dynamicConnection = await createConnection(dynamicConnectionOptions);

    const repo = await dynamicConnection.query(
      'update patient_timeline SET  title = ?, timeline_date = ?, description =?, document= ?, status= ? where hospital_patient_timeline_id = ? and hospital_id = ?',
      [
        opd_timeline.title,
        opd_timeline.timeline_date,
        opd_timeline.description,
        opd_timeline.document,
        opd_timeline.status,
        id,
        opd_timeline.hospital_id
      ]
    );

    console.log("3333");
    return  [{"data ":{
      status:"success",
      "messege":"patient_timeline details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM patient_timeline WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update patient_timeline profile",
         "error":error
      }
      ]
    }
  }

 async remove(id:string) {
  const result = await this.connection.query('delete from patient_timeline WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":"id:"+id+" deleted successfully"
  }]
 }
}
