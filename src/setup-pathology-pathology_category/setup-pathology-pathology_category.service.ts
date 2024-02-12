import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPathologyPathologyCategory } from './entities/setup-pathology-pathology_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupPathologyPathologyCategoryService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  async create(pathology_categoryEntity: SetupPathologyPathologyCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO pathology_category (category_name) VALUES (?)',
      [pathology_categoryEntity.category_name
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO pathology_category (category_name,Hospital_id,hospital_pathology_category_id) VALUES (?,?,?)`,[
      pathology_categoryEntity.category_name,
      pathology_categoryEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"pathology_category details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM pathology_category WHERE id = ?', [result.insertId])
              }}];
  } catch(error){
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }

  async findAll(): Promise<SetupPathologyPathologyCategory[]> {
    const pathology_category = await this.connection.query('SELECT * FROM pathology_category');
    return pathology_category ;
  }

  async findOne(id: string): Promise<SetupPathologyPathologyCategory | null> {
    const pathology_category = await this.connection.query('SELECT * FROM pathology_category WHERE id = ?', [id]);
    
    if (pathology_category.length === 1) {
      return pathology_category ;
    } else {
      return null;
    }
  
  }

  async update(id: string, pathology_categoryEntity: SetupPathologyPathologyCategory): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE pathology_category SET category_name =? WHERE id = ?',
        [pathology_categoryEntity.category_name, 
        
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

  const repo = await dynamicConnection.query(
    'update pathology_category SET category_name = ? where hospital_pathology_category_id =? and Hospital_id= ?',
    [pathology_categoryEntity.category_name,
      id,
      pathology_categoryEntity.Hospital_id

    ]
  )
  
      return  [{"data ":{
      status:"success",
      "message":"pathology_category details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM pathology_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update pathology_category profile",
         "error":error
      }
      ]
    }
  }
  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM pathology_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}