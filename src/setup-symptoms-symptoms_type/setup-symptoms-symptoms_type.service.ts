import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupSymptomsSymptomsType } from './entities/setup-symptoms-symptoms_type.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupSymptomsSymptomsTypeService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(symptoms_typeEntity: SetupSymptomsSymptomsType ) {
   let dynamicConnection;
   try {
    const result = await this.connection.query('INSERT INTO symptoms_classification (symptoms_type) VALUES (?)',
      [symptoms_typeEntity.symptoms_type
       
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
   
    const AdminCategory = await dynamicConnection.query(`insert into symptoms_classification (symptoms_type,Hospital_id,hospital_symptoms_classification_id) values (?,?,?)`,[
      symptoms_typeEntity.symptoms_type,
      symptoms_typeEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "message":"symptoms_classification details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM symptoms_classification WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }

  async findAll(): Promise<SetupSymptomsSymptomsType[]> {
    const symptoms_classification = await this.connection.query('SELECT * FROM symptoms_classification');
    return symptoms_classification ;
  }

  async findOne(id: string): Promise<SetupSymptomsSymptomsType | null> {
    const symptoms_classification = await this.connection.query('SELECT * FROM symptoms_classification WHERE id = ?', [id]);
    
    if (symptoms_classification.length === 1) {
      return symptoms_classification ;
    } else {
      return null;
    }
  }


  async update(id: string, symptoms_typeEntity: SetupSymptomsSymptomsType) : Promise<{ [key: string]: any }[]>{
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE symptoms_classification SET symptoms_type =? WHERE id = ?',
        [symptoms_typeEntity.symptoms_type, 
         id
        ]
      );
      console.log("aaaaaaaaaa");
  
      const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

        process.env.ADMIN_IP,
        process.env.ADMIN_DB_NAME,
        process.env.ADMIN_DB_PASSWORD,
        process.env.ADMIN_DB_USER_NAME
        )
        
      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
       dynamicConnection = await createConnection(dynamicConnectionOptions);
    
    const repo =  await dynamicConnection.query(
      'update symptoms_classification SET symptoms_type = ? where hospital_symptoms_classification_id = ? and Hospital_id= ?',
    
      [symptoms_typeEntity.symptoms_type,
        id,
        symptoms_typeEntity.Hospital_id
      ]
    
    );
    
    console.log("12345");
    
    
    

      return  [{"data ":{
      status:"success",
      "messege":"symptoms_type details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM symptoms_classification WHERE id = ?', [id])
      }}];
      
    } catch (error) {
      console.log("kkkkkkkk");
      return [
        {status:"failed",
         "messege":"cannot update symptoms_type ",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM symptoms_classification WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
