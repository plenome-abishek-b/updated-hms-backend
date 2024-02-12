import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPharmacyDoseInterval } from './entities/setup-pharmacy-dose_interval.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupPharmacyDoseIntervalService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 


  async create(dose_intervalEntity: SetupPharmacyDoseInterval ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO dose_interval (name) VALUES (?)',
      [dose_intervalEntity.name
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO dose_interval (name,Hospital_id,hospital_dose_interval_id) VALUES (?,?,?)`,[
      dose_intervalEntity.name,
      dose_intervalEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();


   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"dose_interval details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM dose_interval WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error;
    }
  }
}




  async findAll(): Promise<SetupPharmacyDoseInterval[]> {
    const dose_interval = await this.connection.query('SELECT * FROM dose_interval');
    return dose_interval ;
  }


  


  async findOne(id: string): Promise<SetupPharmacyDoseInterval | null> {
    const dose_interval = await this.connection.query('SELECT * FROM dose_interval WHERE id = ?', [id]);
    
    if (dose_interval.length === 1) {
      return dose_interval ;
    } else {
      return null;
    }
  }


  

  async update(id: string, dose_intervalEntity: SetupPharmacyDoseInterval): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE dose_interval SET name =? WHERE id = ?',
        [dose_intervalEntity.name, 
         id
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
    
    const repo =  await dynamicConnection.query(
      'update dose_interval SET name = ? where hospital_dose_interval_id = ? and Hospital_id= ?',
    
      [dose_intervalEntity.name,
        id,
        dose_intervalEntity.Hospital_id
      ]
    
    );
    
    console.log("12345");
    
    



      return  [{"data ":{
      status:"success",
      "messege":"dose_interval details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM dose_interval WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update dose_interval profile",
         "error":error
      }
      ]
    }
  }


 

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM dose_interval WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
