import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupFrontOfficePurpose } from './entities/setup_front_office_purpose.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupFrontOfficePurposeService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}



  async create(purposeEntity: SetupFrontOfficePurpose ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try{
    
    const result = await this.connection.query(
      'INSERT INTO visitors_purpose (visitors_purpose,description) VALUES (?,?)',
      [purposeEntity.visitors_purpose,
        purposeEntity.description
       
      ]
    );

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
     
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO visitors_purpose (visitors_purpose,description,Hospital_id,hospital_visitors_purpose_id) VALUES (?,?,?,?)`,[
      purposeEntity.visitors_purpose,
      purposeEntity.description,

      purposeEntity.Hospital_id,
      result.insertId
    ])  
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"purpose details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [result.insertId])
              }}];
  } catch (error){
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }
  }


 
  async findAll(): Promise<SetupFrontOfficePurpose[]> {
    const purpose = await this.connection.query('SELECT * FROM visitors_purpose');
    return purpose ;
  }




  async findOne(id: string): Promise<SetupFrontOfficePurpose | null> {
    const purpose = await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [id]);
    
    if (purpose.length === 1) {
      return purpose ;
    } else {
      return null;
    }
  }



  async update(id: string, purposeEntity: SetupFrontOfficePurpose): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      
      const result = await this.connection.query(
        'UPDATE visitors_purpose SET visitors_purpose =?, description = ? WHERE id = ?',
        [purposeEntity.visitors_purpose,
          purposeEntity.description, 
         id
        ]
      );

      console.log("kkkkkkkk");

      const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
    
        process.env.ADMIN_IP,
        process.env.ADMIN_DB_NAME,
        process.env.ADMIN_DB_PASSWORD,
        process.env.ADMIN_DB_USER_NAME
        )
        
      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
       dynamicConnection = await createConnection(dynamicConnectionOptions);

      const repo = await dynamicConnection.query(
        'update visitors_purpose SET visitors_purpose =?, description = ? where hospital_visitors_purpose_id = ?  and Hospital_id = ? ',
        [
          purposeEntity.visitors_purpose,
          purposeEntity.description,
          id,
          purposeEntity.Hospital_id 
        ]
      )
  
      return  [{"data ":{
      status:"success",
      "messege":"visitors_purpose details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update visitors_purpose profile",
         "error":error
      }
      ]
    }
  }



  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM visitors_purpose WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
