import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupBedFloor } from './entities/setup-bed-floor.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupBedFloorService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ) {}
  
  async create(floorEntity: SetupBedFloor ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO floor (name,description) VALUES (?,?)',
      [floorEntity.name,
        floorEntity.description
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO floor(name,description,Hospital_id,hospital_floor_id) values (?,?,?,?)',[
      floorEntity.name,
      floorEntity.description,
      floorEntity.Hospital_id,
      result.insertId

    ])
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"floor details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM floor WHERE id = ?', [result.insertId])
              }}];
  } catch(error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupBedFloor[]> {
    const floor = await this.connection.query('SELECT * FROM floor');
    return floor ;
  }

  
  async findOne(id: string): Promise<SetupBedFloor | null> {
    const floor = await this.connection.query('SELECT * FROM floor WHERE id = ?', [id]);
    
    if (floor.length === 1) {
      return floor;
    } else {
      return null;
    }
  }


  async update(id: string, floorEntity: SetupBedFloor ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE floor SET name =?, description =? WHERE id = ?',
        [floorEntity.name,
          floorEntity.description,
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
    'update floor SET name =?, description =? where hospital_floor_id = ? and Hospital_id =?',
    [
     floorEntity.name,
     floorEntity.description,
     id,
     floorEntity.Hospital_id 
    ]
  )
  
      return  [{"data ":{
      status:"success",
      "messege":"floor details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM floor WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update floor profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM floor WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }

}
