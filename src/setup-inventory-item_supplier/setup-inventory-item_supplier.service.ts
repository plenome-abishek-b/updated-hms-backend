import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupInventoryItemSupplier } from './entities/setup-inventory-item_supplier.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupInventoryItemSupplierService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(item_supplierEntity: SetupInventoryItemSupplier ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO item_supplier (item_supplier,phone,email,address,contact_person_name,contact_person_phone,contact_person_email,description) VALUES (?,?,?,?,?,?,?,?)',
      [item_supplierEntity.item_supplier,
        item_supplierEntity.phone,
        item_supplierEntity.email,
        item_supplierEntity.address,
        item_supplierEntity.contact_person_name,
        item_supplierEntity.contact_person_phone,
        item_supplierEntity.contact_person_email,
        item_supplierEntity.description
        
       
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
   

    const AdminCategory = await dynamicConnection.query('INSERT INTO item_supplier (item_supplier,phone,email,address,contact_person_name,contact_person_phone,contact_person_email,description,Hospital_id,hospital_item_supplier_id) VALUES (?,?,?,?,?,?,?,?,?,?)',[
      item_supplierEntity.item_supplier,
      item_supplierEntity.phone,
      item_supplierEntity.email,
      item_supplierEntity.address,
      item_supplierEntity.contact_person_name,
      item_supplierEntity.contact_person_phone,
      item_supplierEntity.contact_person_email,
      item_supplierEntity.description,
      item_supplierEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_supplier details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [result.insertId])
              }}];
  }
catch (error ){
  if(dynamicConnection){
  await dynamicConnection.close();
  return error;
  }
  }
}



  async findAll(): Promise<SetupInventoryItemSupplier[]> {
    const item_supplier = await this.connection.query('SELECT * FROM item_supplier');
    return item_supplier ;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemSupplier | null> {
    const item_supplier = await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [id]);
    
    if (item_supplier.length === 1) {
      return item_supplier ;
    } else {
      return null;
    }
  }


  async update(id: string, item_supplierEntity: SetupInventoryItemSupplier): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_supplier SET item_supplier =?, phone =?, email =?, address =?, contact_person_name =?, contact_person_phone =?, contact_person_email =?, description =?  WHERE id = ?',
        [item_supplierEntity.item_supplier,
          item_supplierEntity.phone,
          item_supplierEntity.email,
          item_supplierEntity.address,
          item_supplierEntity.contact_person_name,
          item_supplierEntity.contact_person_phone,
          item_supplierEntity.contact_person_email,
          item_supplierEntity.description,
          
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
    `update item_supplier SET item_supplier =?, phone =?, email =?, address =?, contact_person_name =?, contact_person_phone =?, contact_person_email =?, description =?  where hospital_item_supplier_id = ? and Hospital_id = ?`,
    [
      item_supplierEntity.item_supplier,
      item_supplierEntity.phone,
      item_supplierEntity.email,
      item_supplierEntity.address,
      item_supplierEntity.contact_person_name,
      item_supplierEntity.contact_person_phone,
      item_supplierEntity.contact_person_email,
      item_supplierEntity.description,
      id,
      item_supplierEntity.Hospital_id
    ]
  );
  
      return  [{"data ":{
      status:"success",
      "messege":"item_supplier details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_supplier profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
