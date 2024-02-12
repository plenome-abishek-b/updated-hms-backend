import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPathologyPathologyParameter } from './entities/setup-pathology-pathology_parameter.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupPathologyPathologyParameterService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(pathology_parameterEntity: SetupPathologyPathologyParameter ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try{
    const result = await this.connection.query(
      'INSERT INTO pathology_parameter (parameter_name,test_value,reference_range,gender,unit,description) VALUES (?,?,?,?,?,?)',
      [pathology_parameterEntity.parameter_name,
        pathology_parameterEntity.test_value,
        pathology_parameterEntity.reference_range,
        pathology_parameterEntity.gender,
        pathology_parameterEntity.unit,
        pathology_parameterEntity.description
       
      ]
    );
console.log("sssss");


    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
const [patho_unit] = await dynamicConnection.query(`select id from unit where Hospital_id = ? and hospital_unit_id = ?`,
[pathology_parameterEntity.Hospital_id,
pathology_parameterEntity.unit]
)

    const AdminCategory = await dynamicConnection.query('Insert into pathology_parameter (parameter_name,test_value,reference_range,gender,unit,description,Hospital_id,hospital_pathology_parameter_id) VALUES (?,?,?,?,?,?,?,?)',[
      pathology_parameterEntity.parameter_name,
      pathology_parameterEntity.test_value,
      pathology_parameterEntity.reference_range,
      pathology_parameterEntity.gender,
      patho_unit.id,
            pathology_parameterEntity.description,
      pathology_parameterEntity.Hospital_id,
      result.insertId
    ])

    console.log("entering if",AdminCategory);
              await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"pathology_parameter details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM pathology_parameter WHERE id = ?', [result.insertId])
              }}];
  }
  catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }
}

  
  async findAll(): Promise<SetupPathologyPathologyParameterService[]> {
    const unit = await this.connection.query(`select pathology_parameter.id,pathology_parameter.parameter_name,pathology_parameter.reference_range,unit.unit_name,pathology_parameter.description from pathology_parameter
    left join unit on pathology_parameter.unit = unit.id`);
    return unit ;
  }

  
  async findOne(id: string): Promise<SetupPathologyPathologyParameterService | null> {
    const unit = await this.connection.query(`select pathology_parameter.id,pathology_parameter.parameter_name,pathology_parameter.reference_range,unit.unit_name,pathology_parameter.description from pathology_parameter
    left join unit on pathology_parameter.unit = unit.id WHERE pathology_parameter.id = ?`, [id]);
    
    if (unit.length === 1) {
      return unit ;
    } else {
      return null;
    }
  }


  async update(id: string, pathology_parameterEntity: SetupPathologyPathologyParameter): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE pathology_parameter SET parameter_name =?,reference_range =?,unit =?,description =? WHERE id = ?',
        [ pathology_parameterEntity.parameter_name,
          pathology_parameterEntity.reference_range,
          pathology_parameterEntity.unit,
          pathology_parameterEntity.description,
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
    'update pathology_parameter SET parameter_name = ?,reference_range =?,unit =? ,description =? Where hospital_pathology_parameter_id =? and Hospital_id = ?',
    [
      pathology_parameterEntity.parameter_name,
      pathology_parameterEntity.reference_range,
      pathology_parameterEntity.unit,
      pathology_parameterEntity.description,
      id,
      pathology_parameterEntity.Hospital_id
    ]
  )


  
      return  [{"data ":{
      status:"success",
      "messege":"pathology_parameter details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM pathology_parameter WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update pathology_parameter profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM pathology_parameter WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}