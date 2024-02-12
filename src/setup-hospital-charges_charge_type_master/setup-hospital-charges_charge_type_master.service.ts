import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargesChargeTypeMaster } from './entities/setup-hospital-charges_charge_type_master.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupHospitalChargesChargeTypeMasterService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

  async create(charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection
    try{
      console.log("aaa");

    const result = await this.connection.query(
      'INSERT INTO charge_type_master (charge_type,is_default,is_active) VALUES (?,?,?)',
      [charge_type_masterEntity.charge_type,
        charge_type_masterEntity.is_default,
        charge_type_masterEntity.is_active,
       
      ]
    );
    console.log("aaa");

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )

      console.log("aaa");

    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO charge_type_master (charge_type,is_default,is_active,
      Hospital_id,hospital_charge_type_master_id) VALUES (?,?,?,?,?)`,[
      charge_type_masterEntity.charge_type,
      charge_type_masterEntity.is_default,
      charge_type_masterEntity.is_active,
      charge_type_masterEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_type_master details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [result.insertId])
              }}];
  }
catch (error) {
  if(dynamicConnection){
  await dynamicConnection.close();
  return error
  }
}
}



  async findAll(): Promise<SetupHospitalChargesChargeTypeMaster[]> {
    const charge_type_master = await this.connection.query('SELECT * FROM charge_type_master');
    return charge_type_master ;
  }

  
  async findOne(id: string): Promise<SetupHospitalChargesChargeTypeMaster> {
    const charge_type_master = await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [id]);
    
    if (charge_type_master.length === 1) {
      return charge_type_master ;
    } else {
      return null;
    }
  }


  async update(id: string, charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      
      const result = await this.connection.query(
        'UPDATE charge_type_master SET charge_type =?,  is_default =?,  is_active =? WHERE id = ?',
        [charge_type_masterEntity.charge_type,
          charge_type_masterEntity.is_default,
          charge_type_masterEntity.is_active,
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
    'update charge_type_master SET charge_type = ?, is_default = ?, is_active= ? where hospital_charge_type_master_id = ? and Hospital_id = ? ',
    [
      charge_type_masterEntity.charge_type,
      charge_type_masterEntity.is_default,
      charge_type_masterEntity.is_active,
      id,
      charge_type_masterEntity.Hospital_id
    ]
  )
  
      return  [{"data ":{
      status:"success",
      "messege":"charge_type_master details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charge_type_master profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_type_master WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
