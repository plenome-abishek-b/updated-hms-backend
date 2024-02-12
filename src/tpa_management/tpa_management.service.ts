import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TpaManagement } from './entities/tpa_management.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Connection,createConnection } from 'typeorm';

@Injectable()
export class TpaManagementService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

async create(tpa_managementEntity:TpaManagement) {
  let dynamicConnection;
  try{
    
    const result = await this.connection.query(
      `Insert into organisation (organisation_name,code,contact_no,address,contact_person_name,contact_person_phone) values (?,?,?,?,?,?)`,
      [tpa_managementEntity.organisation_name,
        tpa_managementEntity.code,
        tpa_managementEntity.contact_no,
        tpa_managementEntity.address,
        tpa_managementEntity.contact_person_name,
        tpa_managementEntity.contact_person_phone
      ]
    );
    console.log("ssss");

const tpaid = result.insertId
console.log("wwww",result);

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
console.log("bbbbb");

     const AdminTPA = await dynamicConnection.query(`insert into organisation 
      (organisation_name,code,contact_no,address,contact_person_name,
        contact_person_phone,Hospital_id,hos_organisation_id) values (?,?,?,?,?,?,?,?)`,[
      tpa_managementEntity.organisation_name,
      tpa_managementEntity.code,
      tpa_managementEntity.contact_no,
      tpa_managementEntity.address,
      tpa_managementEntity.contact_person_name,
      tpa_managementEntity.contact_person_phone,
      tpa_managementEntity.Hospital_id,
      tpaid
     ])

     return  [{"data ":{"id  ":tpaid,
              "status":"success",
              "messege":"TPA_management details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM organisation WHERE id = ?', [tpaid])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
}

}

async findAll() {
  const TPA_management = await this.connection.query(`select organisation.id, organisation.organisation_name as name,organisation.code as code,organisation.contact_no as phone,organisation.address as Address,
  organisation.contact_person_name,organisation.contact_person_phone from organisation`);
  return TPA_management;
}

async findone(id:string) {
const TPA_management = await this.connection.query(`select organisation.id, organisation.organisation_name as name,organisation.code as code,organisation.contact_no as phone,organisation.address as Address,
organisation.contact_person_name,organisation.contact_person_phone from organisation where id = ? `, [id]);
return TPA_management;
}

async update(id:string,tpa_managementEntity:TpaManagement ) {
  let dynamicConnection

  try{
    console.log("eee")
    const result = await this.connection.query(
      `UPDATE organisation SET organisation_name = ?, code = ?, contact_no = ?, address = ?, contact_person_name = ?, contact_person_phone = ? where id = ?`,
      [
        tpa_managementEntity.organisation_name,
        tpa_managementEntity.code,
        tpa_managementEntity.contact_no,
        tpa_managementEntity.address,
        tpa_managementEntity.contact_person_name,
        tpa_managementEntity.contact_person_phone,
        id
      ]
    );

    console.log("rrrrrr",result);

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
    )
    
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    dynamicConnection = await createConnection(dynamicConnectionOptions);

    const repo = await dynamicConnection.query(
      `update organisation SET organisation_name = ?,code = ?, contact_no = ?, address = ?, contact_person_name = ?, contact_person_phone = ? 
      where Hospital_id = ? and hos_organisation_id = ? `,[
        tpa_managementEntity.organisation_name,
        tpa_managementEntity.code,
        tpa_managementEntity.contact_no,
        tpa_managementEntity.address,
        tpa_managementEntity.contact_person_name,
        tpa_managementEntity.contact_person_phone,
        tpa_managementEntity.Hospital_id,
        id
      ]
    );

    console.log("2222",repo);

    return [{"data":{
      status:"success",
      "message":"tpa_management details updated successfully",
      "updated_values":await this.connection.query(`select * from organisation where id = ?`, [id])
    
    }}];
  }
  catch (error) {
    return [
      {status:"failed",
    "message":"cannot update organisation",
    "error":error
    }
    ]
  }
}

async remove(id:string,hos_id:number){
  let dynamicConnection;
  try{
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
  
    dynamicConnection = await createConnection(dynamicConnectionOptions);
  
    const deltpa = await dynamicConnection.query(`update organisation set is_deleted = 1 where Hospital_id = ?
    and hos_organisation_id = ?`,[hos_id,id])
    const result = await this.connection.query(`delete from organisation where id = ?`, [id]);
    if (dynamicConnection) {
      await dynamicConnection.close();
    }
    return [{
      "status":"success",
      "message":" id: "+ id+"deleted successfully"
    }
  ]

  } catch (error) {
    if (dynamicConnection) {
      await dynamicConnection.close();
    }
    return error
  }}}
