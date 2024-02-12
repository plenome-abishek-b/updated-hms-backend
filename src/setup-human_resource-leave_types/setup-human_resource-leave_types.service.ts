import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHumanResourceLeaveType } from './entities/setup-human_resource-leave_type.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupHumanResourceLeaveTypesService {
 
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(leavetypesEntity: SetupHumanResourceLeaveType ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO leave_types (type,is_active) VALUES (?,?)',
      [leavetypesEntity.type,
        leavetypesEntity.is_active
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT into leave_types (type,is_active,Hospital_id,hospital_leave_types_id) values (?,?,?,?)`,[
leavetypesEntity.type,
leavetypesEntity.is_active,
leavetypesEntity.Hospital_id,
result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"leave_types details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceLeaveType[]> {
    const leave_types = await this.connection.query('SELECT * FROM leave_types');
    return leave_types;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceLeaveType | null> {
    const leave_types = await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [id]);
    
    if (leave_types.length === 1) {
      return leave_types ;
    } else {
      return null;
    }
  }


  async update(id: string, leavetypesEntity: SetupHumanResourceLeaveType): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE leave_types SET type =? WHERE id = ?',
        [leavetypesEntity.type, 
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
    'update leave_types SET type =? where hospital_leave_types_id =? and Hospital_id= ?',

    [
      leavetypesEntity.type,
      id,
      leavetypesEntity.Hospital_id
    ]
  )
  console.log("aaaaaaa");
  
      return  [{"data ":{
      status:"success",
      "messege":"leave_types details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update leave_types profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM leave_types WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
