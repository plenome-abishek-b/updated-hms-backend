import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupRadiologyRadiologyParameter } from './entities/setup-radiology-radiology_parameter.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupRadiologyRadiologyParameterService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}


  async create(radiology_parameterEntity: SetupRadiologyRadiologyParameter ): Promise<{ [key: string]: any }[]> {
  let dynamicConnection;
  try{

    const result = await this.connection.query(
      'INSERT INTO radiology_parameter (parameter_name,test_value,reference_range,gender,unit,description) VALUES (?,?,?,?,?,?)',
      [radiology_parameterEntity.parameter_name,
        radiology_parameterEntity.test_value,
        radiology_parameterEntity.reference_range,
        radiology_parameterEntity.gender,
        radiology_parameterEntity.unit,
        radiology_parameterEntity.description
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO radiology_parameter
     (parameter_name,test_value,reference_range,gender,unit,description,Hospital_id,hospital_radiology_parameter_id) VALUES (?,?,?,?,?,?,?,?)`,[
      radiology_parameterEntity.parameter_name,
      radiology_parameterEntity.test_value,
      radiology_parameterEntity.reference_range,
      radiology_parameterEntity.gender,
      radiology_parameterEntity.unit,
      radiology_parameterEntity.description,
      radiology_parameterEntity.Hospital_id,

      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();


   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"radiology_parameter details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM radiology_parameter WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
    }
    }
  }




  async findAll(): Promise<SetupRadiologyRadiologyParameter[]> {
    const radiology_parameter = await this.connection.query(`select radiology_parameter.id,radiology_parameter.parameter_name,radiology_parameter.reference_range,unit.unit_name,radiology_parameter.description from radiology_parameter
    left join unit on radiology_parameter.unit = unit.id ;`);
    return radiology_parameter ;
  }

  
  async findOne(id: string): Promise<SetupRadiologyRadiologyParameter | null> {
    const radiology_parameter = await this.connection.query(`select radiology_parameter.id,radiology_parameter.parameter_name,radiology_parameter.reference_range,unit.unit_name,radiology_parameter.description from radiology_parameter
    left join unit on radiology_parameter.unit = unit.id WHERE radiology_parameter.id = ? `, [id]);
    
    if (radiology_parameter.length === 1) {
      return radiology_parameter  ;
    } else {
      return null;
    }
  }


  async update(id: string, radiology_parameterEntity: SetupRadiologyRadiologyParameter): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE radiology_parameter SET parameter_name =?,reference_range =?,unit =?,description =? WHERE id = ?',
        [radiology_parameterEntity.parameter_name,
          radiology_parameterEntity.reference_range,
          radiology_parameterEntity.unit,
          radiology_parameterEntity.description,
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
  const dynamicConnection = await createConnection(dynamicConnectionOptions);

const repo =  await dynamicConnection.query(
  'update radiology_parameter SET parameter_name = ?,reference_range = ?,unit = ?,description = ? where hospital_radiology_parameter_id = ? and Hospital_id= ?',

  [radiology_parameterEntity.parameter_name,
    radiology_parameterEntity.reference_range,
    radiology_parameterEntity.unit,
    radiology_parameterEntity.description,
    id,
    radiology_parameterEntity.Hospital_id
  ]

);

console.log("12345");



  
      return  [{"data ":{
      status:"success",
      "messege":"radiology_parameter details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM radiology_parameter WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update radiology_parameter profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM radiology_parameter WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
