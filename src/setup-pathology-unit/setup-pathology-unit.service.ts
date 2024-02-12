import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPathologyUnit } from './entities/setup-pathology-unit.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupPathologyUnitService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(unitEntity: SetupPathologyUnit ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try{
    const result = await this.connection.query(
      'INSERT INTO unit (unit_name,unit_type) VALUES (?,?)',
      [unitEntity.unit_name,unitEntity.unit_type
       
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
   
    const AdminCategory = await dynamicConnection.query('Insert into unit (unit_name,unit_type,Hospital_id,hospital_unit_id) Values (?,?,?,?)',[
      unitEntity.unit_name,
      unitEntity.unit_type,
      unitEntity.Hospital_id,
      result.insertId
    ])
   
    console.log("entered",AdminCategory);
              await dynamicConnection.close();
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"unit details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM unit WHERE id = ?', [result.insertId])
              }}];
  }catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }
}




  async findAll(): Promise<SetupPathologyUnit[]> {
    const unit = await this.connection.query('SELECT * FROM unit where unit_type = ?',['patho']);
    return unit ;
  }

  
  


  async update(id: string, unitEntity: SetupPathologyUnit): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE unit SET unit_name =? WHERE id = ?',
        [unitEntity.unit_name, 
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
    'update unit SET unit_name = ? where hospital_unit_id = ? and Hospital_id = ?',
    [
      unitEntity.unit_name,
      id,
      unitEntity.Hospital_id
    ]
  )

      return  [{"data ":{
      status:"success",
      "messege":"unit details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM unit WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update unit profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM unit WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
