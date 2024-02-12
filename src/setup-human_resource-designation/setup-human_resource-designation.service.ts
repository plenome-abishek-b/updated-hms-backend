import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHumanResourceDesignation } from './entities/setup-human_resource-designation.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupHumanResourceDesignationService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(designationEntity:SetupHumanResourceDesignation ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO staff_designation (designation,is_active) VALUES (?,?)',
      [designationEntity.designation,
        designationEntity.is_active
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO staff_designation(designation,is_active,Hospital_id,hospital_staff_designation_id) values (?,?,?,?)',[
      designationEntity.designation,
      designationEntity.is_active,
      designationEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering into",AdminCategory);
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"staff_designation details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceDesignation[]> {
    const staff_designation = await this.connection.query('SELECT * FROM staff_designation');
    return staff_designation ;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceDesignation | null> {
    const staff_designation = await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [id]);
    
    if (staff_designation.length === 1) {
      return staff_designation ;
    } else {
      return null;
    }
  }


  async update(id: string, designationEntity: SetupHumanResourceDesignation): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE staff_designation SET designation =? WHERE id = ?',
        [designationEntity.designation, 
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
  `update staff_designation SET designation = ? WHERE hospital_staff_designation_id = ? and Hospital_id = ?`,
  [
    designationEntity.designation,
    id,
    designationEntity.Hospital_id
  ]
)
console.log("12345");


  
      return  [{"data ":{
      status:"success",
      "messege":"staff_designation details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update staff_designation profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM staff_designation WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
