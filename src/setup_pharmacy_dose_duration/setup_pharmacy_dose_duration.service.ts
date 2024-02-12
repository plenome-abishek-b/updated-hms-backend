import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPharmacyDoseDuration } from './entities/setup_pharmacy_dose_duration.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupPharmacyDoseDurationService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  


  async create(dose_durationEntity: SetupPharmacyDoseDuration ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try {
  
   

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    const dynamicConnection = await createConnection(dynamicConnectionOptions);
    const result = await this.connection.query(
      'INSERT INTO dose_duration (name) VALUES (?)',
      [dose_durationEntity.name
       
      ]
    );
    console.log(result,"result111");
    
    const AdminCategory = await dynamicConnection.query('INSERT INTO dose_duration (name,Hospital_id,hospital_dose_duration_id) VALUES (?,?,?)',[
      dose_durationEntity.name,
      dose_durationEntity.Hospital_id,
      result.insertId
    ])
    console.log(AdminCategory,"AdminCategory111");
    

    console.log("cccccc cc",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"dose_duration details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }


  

  async findAll(): Promise<SetupPharmacyDoseDuration[]> {
    const dose_duration = await this.connection.query('SELECT * FROM dose_duration');
    return dose_duration ;
  }




  async findOne(id: string): Promise<SetupPharmacyDoseDuration | null> {
    const dose_duration = await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [id]);
    
    if (dose_duration.length === 1) {
      return dose_duration as SetupPharmacyDoseDuration;
    } else {
      return null;
    }
  }

  


  async update(id: string, dose_durationEntity: SetupPharmacyDoseDuration ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      
      const result = await this.connection.query(
        'UPDATE dose_duration SET name =? WHERE id = ?',
        [dose_durationEntity.name, 
         id
        ]
      );
  console.log("rrrrrrrrrddddddd");

  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);

  const repo = await dynamicConnection.query(
    'update dose_duration SET name = ? where hospital_dose_duration_id = ? and Hospital_id = ?',

    [
      dose_durationEntity.name,
      id,
    dose_durationEntity.Hospital_id
    ]
  );

  console.log("12345");

  
      return  [{"data ":{
      status:"success",
      "messege":"dose_duration details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update dose_duration profile",
         "error":error
      }
      ]
    }
  }




  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM dose_duration WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
