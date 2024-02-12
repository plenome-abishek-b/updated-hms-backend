import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupOperationOperation } from './entities/setup-operation-operation.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupOperationOperationService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 


  async create(operationEntity: SetupOperationOperation ){
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO operation (operation,category_id,is_active) VALUES (?,?,?)',
      [operationEntity.operation,
        operationEntity.category_id,
        operationEntity.is_active       
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
   
console.log("hiii bro");

const [operation_category] = await dynamicConnection.query(`select id from operation_category where Hospital_id = ? and hospital_operation_category_id = ?`, [
  operationEntity.Hospital_id,
  operationEntity.category_id
])

const opcatid = operation_category.id
console.log("dddddddd",operation_category);
  const AdminCategory = await dynamicConnection.query(`Insert into operation 
  ( 
    operation,
    category_id,
    is_active,
    hospital_operation_id,
    Hospital_id) values (?,?,?,?,?)`,[
    operationEntity.operation,
    opcatid,
    operationEntity.is_active,
    result.insertId,
    operationEntity.Hospital_id

  ])
  console.log("entering if",AdminCategory);
  await dynamicConnection.close();
  console.log("sss");
  
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"operation details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM operation WHERE id = ?', [result.insertId])
              }}];

            
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close()
      return error;
    }
    }
  }

  async findAll(): Promise<SetupOperationOperation[]> {
    const operation = await this.connection.query(`select operation.id,operation.operation,operation_category.category,operation_category.is_active from operation
    join operation_category ON operation.category_id = operation_category.id`);
    return operation;
  }

  async findOne(id: string): Promise<SetupOperationOperation | null> {
    const operation = await this.connection.query(`select operation.id,operation.operation,operation_category.category,operation_category.is_active from operation
    join operation_category ON operation.category_id = operation_category.id WHERE operation.id = ?`, [id]);
    
    if (operation.length === 1) {
      return operation ;
    } else {
      return null;
    }
  }

  
  async update(id: string, operationEntity: SetupOperationOperation ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE operation SET operation =?,category_id =? WHERE id = ?',
        [operationEntity.operation,
          operationEntity.category_id, 
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
  'update operation SET operation =?,category_id =? where hospital_operation_id = ? and Hospital_id = ?',
  [
    operationEntity.operation,
    operationEntity.category_id,
    id,
    operationEntity.Hospital_id
  ]
);

      return  [{"data ":{
      status:"success",
      "messege":"operation details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM operation WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update operation profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM operation WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
