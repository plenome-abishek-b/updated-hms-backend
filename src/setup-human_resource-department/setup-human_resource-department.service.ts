import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHumanResourceDepartment } from './entities/setup-human_resource-department.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupHumanResourceDepartmentService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(departmentEntity: SetupHumanResourceDepartment ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO department (department_name,is_active) VALUES (?,?)',
      [departmentEntity.department_name,
        departmentEntity.is_active
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO department (department_name,is_active,Hospital_id,hospital_department_id) values (?,?,?,?)',[
      departmentEntity.department_name,
      departmentEntity.is_active,
      departmentEntity.Hospital_id,
      result.insertId

    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"department details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM department WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceDepartment[]> {
    const department = await this.connection.query('SELECT * FROM department');
    return department ;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceDepartment | null> {
    const department = await this.connection.query('SELECT * FROM department WHERE id = ?', [id]);
    
    if (department.length === 1) {
      return department ;
    } else {
      return null;
    }
  }


  async update(id: string, departmentEntity: SetupHumanResourceDepartment): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE department SET department_name =? WHERE id = ?',
        [departmentEntity.department_name, 
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
  'update department SET department_name = ? where hospital_department_id = ? and Hospital_id= ?',
  [
    departmentEntity.department_name,
    id,
    departmentEntity.Hospital_id
  ]
  )
  console.log("aaaaaaaa");
  
  
      return  [{"data ":{
      status:"success",
      "messege":"department details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM department WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update department profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM department WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
