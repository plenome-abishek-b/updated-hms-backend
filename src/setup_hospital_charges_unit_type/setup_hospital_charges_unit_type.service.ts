import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import {SetupHospitalChargesUnitType} from './entities/setup_hospital_charges_unit_type.entity'
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class unit_typeService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(unit_typeEntity: SetupHospitalChargesUnitType ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO charge_units (unit) VALUES (?)',
      [unit_typeEntity.unit
       
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
   

    const AdminCategory = await dynamicConnection.query('INSERT INTO charge_units (unit,Hospital_id,hospital_charge_units_id) VALUES (?,?,?)',[
      unit_typeEntity.unit,
      unit_typeEntity.Hospital_id,
      result.insertId
    ])
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_units details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupHospitalChargesUnitType[]> {
    const unit_type = await this.connection.query('SELECT * FROM charge_units');
    return unit_type ;
  }


  
  async findOne(id: string) {
    const unit_type = await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [id]);
    
    if (unit_type.length === 1) {
      return unit_type ;
    } else {
      return null;
    }
  }


  async update(id: string, unit_typeEntity: SetupHospitalChargesUnitType): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try { 
      
      const result = await this.connection.query(
        'UPDATE charge_units SET unit =? WHERE id = ?',
        [unit_typeEntity.unit, 
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
    'update charge_units SET unit = ? where hospital_charge_units_id = ? and Hospital_id = ?',
    [unit_typeEntity.unit,
      id,
      unit_typeEntity.Hospital_id
    ]
  )
  console.log("12345");

  
      return  [{"data ":{
      status:"success",
      "messege":"charge_units details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charge_units profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_units WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}