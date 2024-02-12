import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupSymptomsSymptomsHead } from './entities/setup-symptoms-symptoms_head.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupSymptomsSymptomsHeadService {

  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  async create(symptoms_headEntity: SetupSymptomsSymptomsHead ) {
 let dynamicConnection;
 try{
    const result = await this.connection.query(
      'INSERT INTO symptoms (symptoms_title,description,type) VALUES (?,?,?)',
      [symptoms_headEntity.symptoms_title,
        symptoms_headEntity.description,
        symptoms_headEntity.type
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO symptoms (symptoms_title,description,type,Hospital_id,hospital_symptoms_id) VALUES (?,?,?,?,?)`,[
      symptoms_headEntity.symptoms_title,
      symptoms_headEntity.description,
      symptoms_headEntity.type,
      symptoms_headEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);

              await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"symptoms details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM symptoms WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
       await dynamicConnection.close();
return error
    }
    }
  }




  async findAll(): Promise<SetupSymptomsSymptomsHead[]> {
    const symptoms = await this.connection.query(`select symptoms.id,symptoms.symptoms_title as symptoms_head,symptoms.description,symptoms_classification.symptoms_type from symptoms
    left join symptoms_classification on symptoms.type = symptoms_classification.id`);
    return symptoms ;
  }

  
  async findOne(id: string): Promise<SetupSymptomsSymptomsHead | null> {
    const symptoms = await this.connection.query(`select symptoms.id,symptoms.symptoms_title as symptoms_head,symptoms.description,symptoms_classification.symptoms_type from symptoms
    left join symptoms_classification on symptoms.type = symptoms_classification.id WHERE id = ?`, [id]);
    
    if (symptoms.length === 1) {
      return symptoms ;
    } else {
      return null;
    }
  }


  async update(id: string,symptoms_headEntity: SetupSymptomsSymptomsHead ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE symptoms SET symptoms_title =? , description =?, type =? WHERE id = ?',
        [symptoms_headEntity.symptoms_title,
          symptoms_headEntity.description,
          symptoms_headEntity.type, 
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

const repo =  await dynamicConnection.query(
  'update symptoms SET symptoms_title = ?,description =?, type =?  where hospital_symptoms_id = ? and Hospital_id= ?',

  [symptoms_headEntity.symptoms_title,
    symptoms_headEntity.description,
    symptoms_headEntity.type,
    id,
    symptoms_headEntity.Hospital_id
  ]

);

console.log("12345");


  
      return  [{"data ":{
      status:"success",
      "messege":"symptoms details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM symptoms WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update symptoms profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM symptoms WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
