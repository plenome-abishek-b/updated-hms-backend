import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPharmacySupplier } from './entities/setup_pharmacy_supplier.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupPharmacySupplierService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

 

  async create(supplierEntity: SetupPharmacySupplier ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO medicine_supplier (supplier,contact,supplier_person,supplier_person_contact,supplier_drug_licence,address) VALUES (?,?,?,?,?,?)',
      [supplierEntity.supplier,
        supplierEntity.contact,
        supplierEntity.supplier_person,
        supplierEntity.supplier_person_contact,
        supplierEntity.supplier_drug_licence,
        supplierEntity.address
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO medicine_supplier (supplier,contact,supplier_person,supplier_person_contact,supplier_drug_licence,address,Hospital_id,hospital_medicine_supplier_id) values (?,?,?,?,?,?,?,?)',[
      supplierEntity.supplier,
      supplierEntity.contact,
      supplierEntity.supplier_person,
      supplierEntity.supplier_person_contact,
      supplierEntity.supplier_drug_licence,
      supplierEntity.address,
      supplierEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close(); 

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"medicine_supplier details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [result.insertId])
              }}];
  } catch(error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




 

  async findAll(): Promise<SetupPharmacySupplier[]> {
    const supplier = await this.connection.query('SELECT * FROM medicine_supplier');
    return supplier ;
  }

 
  async findOne(id: string): Promise<SetupPharmacySupplier | null> {
    const supplier = await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [id]);
    
    if (supplier.length === 1) {
      return supplier ;
    } else {
      return null;
    }
  }

 
  
  async update(id: string, supplierEntity: SetupPharmacySupplier): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE medicine_supplier SET supplier =?,contact =?,supplier_person =?,supplier_person_contact =?,supplier_drug_licence =?,address =? WHERE id = ?',
        [supplierEntity.supplier, 
          supplierEntity.contact,
          supplierEntity.supplier_person,
          supplierEntity.supplier_person_contact,
          supplierEntity.supplier_drug_licence,
          supplierEntity.address,
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
    'update medicine_supplier SET supplier =?,contact =?,supplier_person =?,supplier_person_contact =?,supplier_drug_licence =?,address =? where hospital_medicine_supplier_id =? and Hospital_id =?',
    [
      supplierEntity.supplier,
      supplierEntity.contact,
      supplierEntity.supplier_person,
      supplierEntity.supplier_person_contact,
      supplierEntity.supplier_drug_licence,
      supplierEntity.address,
      id,
      supplierEntity.Hospital_id
    ]
  )
      return  [{"data ":{
      status:"success",
      "message":"supplier details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_supplier profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_supplier WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
