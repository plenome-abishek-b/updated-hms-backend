/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargesChargeTypeModule } from './entities/setup-hospital-charges_charge_type_module.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { CharsetToEncoding } from 'mysql2';
 
@Injectable()
export class SetupHospitalChargesChargeTypeModuleService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
 
  ) {}
 
  async create(charge_type_moduleEntity: SetupHospitalChargesChargeTypeModule ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{
    const result = await this.connection.query(
      'INSERT INTO charge_type_module (charge_type_master_id,module_shortcode) VALUES (?,?)',
      [charge_type_moduleEntity.charge_type_master_id,
        charge_type_moduleEntity.module_shortcode,
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO charge_type_module (charge_type_master_id,module_shortcode,Hospital_id,hospital_charge_type_module_id) VALUES (?,?,?,?)',[
      charge_type_moduleEntity.charge_type_master_id,
      charge_type_moduleEntity.module_shortcode,
      charge_type_moduleEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data":{"id":result.insertId,
              "status":"success",
              "messege":"charge_type_module details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [result.insertId])
              }}];
  } catch(error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }
 
 
 
 
  // async findAll(): Promise<SetupHospitalChargesChargeTypeModuleService[]> {
  //     let q = `select distinct charge_type_master.id,
  //         charge_type_master.charge_type as charge_type,
  //         group_concat(distinct concat(charge_type_module.module_shortcode) separator',') as module_shortcode
  //         from charge_type_module
  //         join charge_type_master ON charge_type_module.charge_type_master_id = charge_type_master.id
  //         group by charge_type_master.id`;
 
  //     // console.log(q);
 
  //     const charge_type_modules = await this.connection.query(q);
  //     return charge_type_modules;
  // }\
  async findAll(): Promise<SetupHospitalChargesChargeTypeModuleService[]> {
   
    const q =
    `SELECT
    charge_type_master.id,
    charge_type_master.charge_type AS charge_type,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', charge_type_module.id,
            'module_shortcode', charge_type_module.module_shortcode
        )
    ) AS modules
  FROM charge_type_master
  LEFT JOIN charge_type_module ON charge_type_module.charge_type_master_id = charge_type_master.id
  GROUP BY charge_type_master.id;
  `
      const charge_type_modules = await this.connection.query(q);
   
     
      console.log(charge_type_modules,"e");
     
      const predefinedModules = ['appointment','ipd', 'opd', 'pathology', 'radiology', 'bloodbank', 'ambulance'];
   
      const mapModules = (modules) => {
        return predefinedModules.reduce((acc, moduleName) => {
          const module = modules.find((module) => module.module_shortcode === moduleName);
          const id = module ? module.id : null;
          acc[moduleName] = { id, value: !!module };
          return acc;
        }, {});
      };
     
   
      console.log(charge_type_modules[1]?.modules,"shhhh");
     
     
      // Transform the result to return an array of objects
      const formattedResults = charge_type_modules.map(chargeTypeModule => {
        return {
          id: chargeTypeModule.id,
          // charge_type_id:chargeTypeModule?.modules?.
          charge_type: chargeTypeModule.charge_type,
          modules: Array.isArray(chargeTypeModule.modules)
          ? mapModules(chargeTypeModule.modules)
          : {},
        };
      });
      // console.log(formattedResults,"shhhh");
      //  console.log(formattedResults,"loging data");
       
      return formattedResults;
    }
 
 
 
 
  async findOne(id: string): Promise<SetupHospitalChargesChargeTypeModuleService> {
    const charge_type_module = await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [id]);
   
    if (charge_type_module.length === 1) {
      return charge_type_module ;
    } else {
      return null;
    }
  }
 
 
  async update(id: string, charge_type_moduleEntity: SetupHospitalChargesChargeTypeModule ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      console.log(id,charge_type_moduleEntity,"updating data");
     
     
     
      const result = await this.connection.query(
        'UPDATE charge_type_module SET charge_type_master_id =?,  module_shortcode =?  WHERE id = ?',
        [charge_type_moduleEntity.charge_type_master_id,
          charge_type_moduleEntity.module_shortcode,
         id
        ]
      );
  console.log("kkkkkkkk");
  console.log(result,"res");
 
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
   
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
 
  const repo = await dynamicConnection.query(
    'update charge_type_module SET charge_type_master_id =?,  module_shortcode =? where hospital_charge_type_module_id = ? and Hospital_id = ?',
    [
      charge_type_moduleEntity.charge_type_master_id,
      charge_type_moduleEntity.module_shortcode,
      id,
      charge_type_moduleEntity.hospital_charge_type_module_id
    ]
  )
 
 
      return  [{"data ":{
      status:"success",
      "messege":"charge_type_module details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [id])
      }}];
    } catch (error) {
      console.log(error,"ee");
     
      return [
        {status:"failed",
         "messege":"cannot update charge_type_module profile",
         "error":error
      }
      ]
    }
  }
 
  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_type_module WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}