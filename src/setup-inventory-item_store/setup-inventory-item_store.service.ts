import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupInventoryItemStore } from './entities/setup-inventory-item_store.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupInventoryItemStoreService {
 
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(item_storeEntity: SetupInventoryItemStore ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{
    const result = await this.connection.query(
      'INSERT INTO item_store (item_store,code,description) VALUES (?,?,?)',
      [item_storeEntity.item_store,
        item_storeEntity.code,
        item_storeEntity.description,
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO item_store (item_store,code,description,Hospital_id,hospital_item_store_id) VALUES (?,?,?,?,?)`,[
      item_storeEntity.item_store,
      item_storeEntity.code,
      item_storeEntity.description,
      item_storeEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_store details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_store WHERE id = ?', [result.insertId])
              }}];
  } catch (error){
    if(dynamicConnection){
      await dynamicConnection.close();
      return error;
    }
    }
  }




  async findAll(): Promise<SetupInventoryItemStore[]> {
    const item_store = await this.connection.query('SELECT * FROM item_store');
    return item_store ;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemStore | null> {
    const item_store = await this.connection.query('SELECT * FROM item_store WHERE id = ?', [id]);
    
    if (item_store.length === 1) {
      return item_store ;
    } else {
      return null;
    }
  }


  async update(id: string,item_storeEntity: SetupInventoryItemStore ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_store SET item_store =?, code =?, description =? WHERE id = ?',
        [item_storeEntity.item_store, 
          item_storeEntity.code,
          item_storeEntity.description,
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
    'update item_store SET item_store =?, code =?, description =? where hospital_item_store_id = ? and Hospital_id= ?',

    [
      item_storeEntity.item_store,
      item_storeEntity.code,
      item_storeEntity.description,
      id,
      item_storeEntity.Hospital_id
    ]
  )
  
      return  [{"data ":{
      status:"success",
      "messege":"item_store details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_store WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_store profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM item_store WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
