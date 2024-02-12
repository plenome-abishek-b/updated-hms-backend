import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupRadiologyRadiologyCategory } from './entities/setup-radiology-radiology_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupRadiologyRadiologyCategoryService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(radiology_categoryEntity: SetupRadiologyRadiologyCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO lab (lab_name) VALUES (?)',
      [radiology_categoryEntity.lab_name
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO lab (lab_name,Hospital_id,hospital_lab_id) VALUES (?,?,?)`,[
      radiology_categoryEntity.lab_name,
      radiology_categoryEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();



   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"lab details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM lab WHERE id = ?', [result.insertId])
              }}];
  } catch (error){
    if(dynamicConnection){
      await dynamicConnection.close();
        return error;
      }
    }
  }


  async findAll(): Promise<SetupRadiologyRadiologyCategory[]> {
    const lab = await this.connection.query('SELECT * FROM lab');
    return lab ;
  }

  
  async findOne(id: string): Promise<SetupRadiologyRadiologyCategory | null> {
    const lab = await this.connection.query('SELECT * FROM lab WHERE id = ?', [id]);
    
    if (lab.length === 1) {
      return lab ;
    } else {
      return null;
    }
  }

 
  

  async update(id: string, radiology_categoryEntity: SetupRadiologyRadiologyCategory ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE lab SET lab_name =? WHERE id = ?',
        [radiology_categoryEntity.lab_name, 
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
  'update lab SET lab_name = ? where hospital_lab_id = ? and Hospital_id= ?',

  [radiology_categoryEntity.lab_name,
    id,
    radiology_categoryEntity.Hospital_id
  ]

);

console.log("12345");


  
      return  [{"data ":{
      status:"success",
      "messege":"lab details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM lab WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update lab profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM lab WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
