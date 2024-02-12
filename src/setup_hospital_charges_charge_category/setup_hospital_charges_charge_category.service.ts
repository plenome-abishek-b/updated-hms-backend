import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargesChargeCategory } from './entities/setup_hospital_charges_charge_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupHospitalChargesChargeCategoryService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}



  async create(charge_categoryEntity: SetupHospitalChargesChargeCategory): Promise<{[key: string]: any}[]>{
 let dynamicConnection;
 
 try{
  

 const  result = await this.connection.query(
    'INSERT INTO charge_categories (charge_type_id,name,description,is_default) VALUES (?,?,?,?)',
   [charge_categoryEntity.charge_type_id,
    charge_categoryEntity.name,
    charge_categoryEntity.description,
    charge_categoryEntity.is_default
  ]
    );
    const charge_cate = result.insertId
    console.log(charge_cate,"!!!!!!!!!")

 

 ;


  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
 
   console.log("sssss");
   
const [charge_category] = await dynamicConnection.query(`select id from charge_type_master where Hospital_id = ?
and hospital_charge_type_master_id = ?`, [
  charge_categoryEntity.Hospital_id,
  charge_categoryEntity.charge_type_id
])
console.log("charge_category",charge_category);


  const AdminCategory = await dynamicConnection.query(`INSERT INTO charge_categories (charge_type_id,name,description,short_code,is_default,Hospital_id,hospital_charge_categories_id) values (?,?,?,?,?,?,?)`,[
charge_category.id,
    charge_categoryEntity.name,
    charge_categoryEntity.description,
    charge_categoryEntity.short_code,
    charge_categoryEntity.is_default,
    charge_categoryEntity.Hospital_id,
    result.insertId
  ])
  console.log("entering if",AdminCategory);
  await dynamicConnection.close();

  return [{"data":{"id ":result.insertId,
  "status":"success",
  "messege":"charge_category details added successfully inserted",
  "inserted_data": await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [result.insertId])
  }}];
} catch (error) {
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }
}
}



async findAll() {
  const charge_category = await this.connection.query(`select charge_categories.id,charge_type_master.charge_type,charge_categories.name,charge_categories.description,charge_categories.short_code,charge_categories.is_default,
  charge_categories.created_at from charge_categories
  join charge_type_master ON charge_categories.charge_type_id = charge_type_master.id`);
  return charge_category ;
}

async findOne(id: string): Promise<SetupHospitalChargesChargeCategory[]> {
  const charge_category = await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [id]);
  
    return charge_category ;
 
}



async update(id: string, charge_categoryEntity: SetupHospitalChargesChargeCategory): Promise<{ [key: string]: any }[]> {
  let dynamicConnection;

  try {
    console.log("dddd");
    const result = await this.connection.query(
      'UPDATE charge_categories SET charge_type_id =?,name =?,description =?  WHERE id = ?',
      [charge_categoryEntity.charge_type_id, 
        charge_categoryEntity.name,
        charge_categoryEntity.description,
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
'update charge_categories SET  charge_type_id =?,name =?,description =? where hospital_charge_categories_id = ? and Hospital_id = ?',[
  charge_categoryEntity.charge_type_id,
  charge_categoryEntity.name,
  charge_categoryEntity.description,
  id,
  charge_categoryEntity.Hospital_id
]);

console.log("12345");

    return  [{"data ":{
    status:"success",
    "messege":"charge_categories details updated successfully inserted",
    "updated_values":await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [id])
    }}];
    
    
  } catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update charge_categories profile",
       "error":error
    }
    ]
  }
}

async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM charge_categories WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
}


}