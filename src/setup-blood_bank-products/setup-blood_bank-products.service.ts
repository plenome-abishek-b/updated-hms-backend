import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupBloodBankProduct } from './entities/setup-blood_bank-product.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupBloodBankProductsService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

  async create(bloodproductsEntity: SetupBloodBankProduct ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO blood_bank_products (name,is_blood_group) VALUES (?,?)',
      [bloodproductsEntity.name,
        bloodproductsEntity.is_blood_group
       
      ]
    );

    console.log("qqqq");
    
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    const dynamicConnection = await createConnection(dynamicConnectionOptions);
   

    
    const AdminCategory = await dynamicConnection.query('INSERT INTO blood_bank_products (name,is_blood_group,Hospital_id,hospital_blood_bank_products_id) values (?,?,?,?)',[
      bloodproductsEntity.name,
      bloodproductsEntity.is_blood_group,
      bloodproductsEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"blood_bank_products details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [result.insertId])
              }}];
  }
catch(error){
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }
  }
}
  async findAll(): Promise<SetupBloodBankProduct[]> {
    const blood_bank_products = await this.connection.query('SELECT * FROM blood_bank_products where is_blood_group = ?',['1']);
    return blood_bank_products ;
  }
  
  async findOne(id: string): Promise<SetupBloodBankProduct | null> {
    const blood_bank_products = await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [id]);
    
    if (blood_bank_products.length === 1) {
      return blood_bank_products ;
    } else {
      return null;
    }
  }

  async update(id: string, bloodproductsEntity: SetupBloodBankProduct): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE blood_bank_products SET name =? ,is_blood_group =?  WHERE id = ?',
        [bloodproductsEntity.name,
          bloodproductsEntity.is_blood_group,
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
    'update blood_bank_products SET  name =? ,is_blood_group =? where hospital_blood_bank_products_id = ? and Hospital_id= ?',

    [
      bloodproductsEntity.name,
      bloodproductsEntity.is_blood_group,
      id,
      bloodproductsEntity.Hospital_id
    ]
  )

      return  [{"data ":{
      status:"success",
      "messege":"blood_bank_products details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update blood_bank_products profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM blood_bank_products WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
