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

    
    const HOSpatient = await this.connection.query('select * from patients where id =?',[opd_timeline.patient_id] )
    console.log(HOSpatient,".........");

    let HOspatientmobileno = HOSpatient[0].mobileno
    console.log(HOspatientmobileno,"ssssss");

    let HOSTrimmedmobileno;
console.log(HOspatientmobileno.length,"rrrrrrrr")

    if(HOspatientmobileno.length > 10) {
      console.log("entering_mobile_no_if")

   HOSTrimmedmobileno = HOspatientmobileno.startsWith('91') ? HOspatientmobileno.slice(2):HOspatientmobileno;
    console.log(HOspatientmobileno,"HOS",HOSTrimmedmobileno);
  }
  
    else
    
    {
      console.log("entering_mobile_no_if")

      HOSTrimmedmobileno = HOspatientmobileno;
    }
    
    console.log(HOspatientmobileno,"aaaa");


  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
 
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
   const [AdminPatEmail] = await dynamicConnection.query(`select id from patients where email = ?`,[HOSpatient[0].email])

   console.log("AdminPatEmail",AdminPatEmail);
   

   var currentDate = new Date();
   var year = currentDate.getFullYear();
   var month = currentDate.getMonth() + 1;
    // Adding 1 because months are zero-indexed
    var day = currentDate.getDate();
     // Formatting the date with leading zeros if needed
     var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
      console.log("Current Date: " + formattedDate);

 console.log("aaaaaa,,,,,,aaaaa",
 opd_timeline.patient_id,
 opd_timeline.title,
 opd_timeline.timeline_date,
 opd_timeline.description,
 opd_timeline.document,
 opd_timeline.status,
 formattedDate,
 opd_timeline.generated_users_type,
 opd_timeline.generated_users_id);
 
  
   const result = await this.connection.query(`insert into patient_timeline 
   (patient_id,
    title,
    timeline_date,
    description,
    document,
    status,
    date,
    generated_users_type,
    generated_users_id
    )
    values (?,?,?,?,?,?,?,?,?)`,
   [
     opd_timeline.patient_id,
     opd_timeline.title,
     opd_timeline.timeline_date,
     opd_timeline.description,
     opd_timeline.document,
     opd_timeline.status,
     formattedDate,
     opd_timeline.generated_users_type,
     opd_timeline.generated_users_id
   ]);


console.log("ssssss")

   const AdminCategory = await dynamicConnection.query(`insert into patient_timeline (patient_id,title,timeline_date,description,document,status,date,generated_users_type,generated_users_id,hospital_id,hospital_patient_timeline_id) values (?,?,?,?,?,?,?,?,?,?,?)`,[
    AdminPatEmail.id,
    opd_timeline.title,
    opd_timeline.timeline_date,
    opd_timeline.description,
    opd_timeline.document,
    opd_timeline.status,
    formattedDate,
    opd_timeline.generated_users_type,
    opd_timeline.generated_users_id,
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

 async remove(id:string,hosId:number) {
  let dynamicConnection

  const result = await this.connection.query('delete from patient_timeline WHERE id = ?', [id]);

  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
 
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
   console.log("ssss", hosId,
   id);
   
const [admindel] = await dynamicConnection.query(`select id from patient_timeline where
 hospital_id = ? and hospital_patient_timeline_id = ?`, [
  hosId,
 id
])

console.log("admindel",admindel)
   const resul = await dynamicConnection.query (`delete from patient_timeline
     where hospital_patient_timeline_id = ?
      and hospital_id = ?`,[
     id,
      hosId
      
     ])
console.log(resul,"resul");


  return [{
    "status":"success",
    "message":"id:"+id+" deleted successfully"
  }]
 }
}
