import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupInventoryItemCategory } from './entities/setup-inventory-item_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupInventoryItemCategoryService {
 
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(item_categoryEntity: SetupInventoryItemCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{
    const result = await this.connection.query(
      'INSERT INTO item_category (item_category,is_active,description) VALUES (?,?,?)',
      [item_categoryEntity.item_category,
        item_categoryEntity.is_active,
        item_categoryEntity.description,
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO item_category (item_category,is_active,description,Hospital_id,hospital_item_category_id) VALUES (?,?,?,?,?)`,[
      item_categoryEntity.item_category,
      item_categoryEntity.is_active,
      item_categoryEntity.description,
      item_categoryEntity.Hospital_id,
      result.insertId
    ])
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_category WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error;
    }
    }
  }




  async findAll(): Promise<SetupInventoryItemCategory[]> {
    const item_category = await this.connection.query('SELECT * FROM item_category');
    return item_category;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemCategory | null> {
    const item_category = await this.connection.query('SELECT * FROM item_category WHERE id = ?', [id]);
    
    if (item_category.length === 1) {
      return item_category ;
    } else {
      return null;
    }
  }


  async update(id: string,item_categoryEntity: SetupInventoryItemCategory ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_category SET item_category =?,  description =? WHERE id = ?',
        [item_categoryEntity.item_category, 
          item_categoryEntity.description,
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
    'update item_category SET item_category =?,  description =?  where hospital_item_category_id = ? and Hospital_id= ?',

    [
      item_categoryEntity.item_category,
      item_categoryEntity.description,
      id,
      item_categoryEntity.Hospital_id
    ]
  );
  console.log("aaaaaaa");
  
      return  [{"data ":{
      status:"success",
      "messege":"item_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM item_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
