import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupOperationOperationCategory } from './entities/setup-operation-operation_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupOperationOperationCategoryService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(operation_categoryrEntity: SetupOperationOperationCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO operation_category (category,is_active) VALUES (?,?)',
      [operation_categoryrEntity.category,
        operation_categoryrEntity.is_active
       
      ]
    );

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    const dynamicConnection = await createConnection(dynamicConnectionOptions);
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO operation_category(category,is_active,Hospital_id,hospital_operation_category_id) values (?,?,?,?)`,[
      operation_categoryrEntity.category,
      operation_categoryrEntity.is_active,
      operation_categoryrEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"operation_category details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }

  
  async findAll(): Promise<SetupOperationOperationCategory[]> {
    const operation_category = await this.connection.query('SELECT * FROM operation_category');
    return operation_category ;
  }
    
  

  
  async findOne(id: string): Promise<SetupOperationOperationCategory | null> {
    const unit = await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [id]);
    
    if (unit.length === 1) {
      return unit ;
    } else {
      return null;
    }
  }


  async update(id: string, operation_categoryEntity: SetupOperationOperationCategory): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE operation_category SET category =? WHERE id = ?',
        [ operation_categoryEntity.category,
         id
        ]
      );
  console.log("sssss");

  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);

  const repo = await dynamicConnection.query(
    'update operation_category SET category = ? where hospital_operation_category_id =? and Hospital_id = ?',

    [operation_categoryEntity.category,
      id,
  operation_categoryEntity.Hospital_id
  
]
  );
  console.log("zzzzzzzzzzz")
  
      return  [{"data ":{
      status:"success",
      "messege":"operation_category details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update operation_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM operation_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }  
}
