import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHumanResourceSpecialist } from './entities/setup-human_resource-specialist.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupHumanResourceSpecialistService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(specialsitEntity: SetupHumanResourceSpecialist ) {
    const result = await this.connection.query(
      'INSERT INTO specialist (specialist_name,is_active) VALUES (?,?)',
      [specialsitEntity.specialist_name,
        specialsitEntity.is_active
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO specialist (specialist_name,is_active,Hospital_id,hospital_specialist_id) VALUES (?,?,?,?)`,[
      specialsitEntity.specialist_name,
      specialsitEntity.is_active,
      specialsitEntity.Hospital_id,
      result.insertId
    ]  )

    console.log("sssss",AdminCategory);
    await dynamicConnection.close();
    
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"specialist details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM specialist WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceSpecialist[]> {
    const specialsist = await this.connection.query('SELECT * FROM specialist');
    return specialsist ;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceSpecialist | null> {
    const specialsist = await this.connection.query('SELECT * FROM specialist WHERE id = ?', [id]);
    
    if (specialsist.length === 1) {
      return specialsist ;
    } else {
      return null;
    }
  }


  async update(id: string, specialsitEntity: SetupHumanResourceSpecialist ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE specialist SET specialist_name =? WHERE id = ?',
        [specialsitEntity.specialist_name, 
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

  const repo = await dynamicConnection.query(
    'update specialist SET specialist_name =? where hospital_specialist_id = ? and Hospital_id =?',
    [
      specialsitEntity.specialist_name,
      id,
      specialsitEntity.Hospital_id
    ]
  )
  console.log("aaaaa")
  
      return  [{"data ":{
      status:"success",
      "messege":"specialist details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM specialist WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update specialist profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM specialist WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
