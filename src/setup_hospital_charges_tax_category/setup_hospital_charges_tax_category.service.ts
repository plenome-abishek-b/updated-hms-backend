import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargesTaxCategory } from './entities/setup_hospital_charges_tax_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class tax_categoryservice {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}


  async create(tax_categoryEntity: SetupHospitalChargesTaxCategory ): Promise<{[key: string]: any}[]>{
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO tax_category (name,percentage) VALUES (?,?)',
      [tax_categoryEntity.name,
        tax_categoryEntity.percentage
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO tax_category (name,percentage,Hospital_id,hospital_tax_category_id) VALUES (?,?,?,?)`,[
      tax_categoryEntity.name,
      tax_categoryEntity.percentage,
      tax_categoryEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

     return [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"tax_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }


  async findAll() {
    const tax_category = await this.connection.query('SELECT * FROM tax_category');
    return tax_category ;
  }

  async findOne(id: number) {
    const tax_category = await this.connection.query('SELECT * FROM tax_category where id = ?',[id]);
    return tax_category;
    // return `This action returns a #${id} setupHospitalChargesTaxCategory`;
  }

 async update(id: number, tax_categoryEntity: SetupHospitalChargesTaxCategory ):Promise<{ [key:string]: any}[]> {
  let dynamicConnection;

  try {
    const result = await this.connection.query(
      'update tax_category SET name = ?, percentage = ? where id = ?',
      [tax_categoryEntity.name,
        tax_categoryEntity.percentage,
        id

      ]
    );

    console.log("zzzzzzzzz");

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);

    const repo = await dynamicConnection.query(
      'update tax_category SET  name = ?, percentage = ? where hospital_tax_category_id = ? and Hospital_id = ?',

      [
        tax_categoryEntity.name,
        tax_categoryEntity.percentage,
        id,
        tax_categoryEntity.Hospital_id
      ]
    );
    console.log("12345");


    
    return  [{"data ":{
      status:"success",
      "message":"tax_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update tax_category module",
  }
  ]
}
 }

 async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM tax_category WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
  }
}
