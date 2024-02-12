import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupBedBedGroup } from './entities/setup-bed-bed_group.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupBedBedGroupService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(bed_groupEntity: SetupBedBedGroup ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try {
    const result = await this.connection.query(
      'INSERT INTO bed_group (name,color,description,floor,is_active) VALUES (?,?,?,?,?)',
      [bed_groupEntity.name,
        bed_groupEntity.color,
        bed_groupEntity.description,
        bed_groupEntity.floor,
        bed_groupEntity.is_active,
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO bed_group (name,color,description,floor,is_active,Hospital_id,hospital_bed_group_id) VALUES (?,?,?,?,?,?,?)',[
      bed_groupEntity.name,
      bed_groupEntity.color,
      bed_groupEntity.description,
      bed_groupEntity.floor,
      bed_groupEntity.is_active,
      bed_groupEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"bed_group details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM bed_group WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupBedBedGroup[]> {
    const bed_group = await this.connection.query('SELECT bed_group.id, bed_group.name, floor.name AS floor_name, bed_group.description, bed_group.color, bed_group.is_active  FROM bed_group  JOIN floor ON bed_group.floor = floor.id');
    return bed_group ;
  }

  
  async findOne(id: string): Promise<SetupBedBedGroup | null> {
    const bed_group = await this.connection.query('SELECT bed_group.id, bed_group.name, floor.name AS floor_name, bed_group.description, bed_group.color, bed_group.is_active  FROM bed_group  JOIN floor ON bed_group.floor = floor.id WHERE bed_group.id = ?', [id]);
    
    if (bed_group.length === 1) {
      return bed_group ;
    } else {
      return null;
    }
  }


  async update(id: string,bed_groupEntity: SetupBedBedGroup): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      
      const result = await this.connection.query(
        'UPDATE bed_group SET name =? , color =? , description =? , floor =? WHERE id = ?',
        [bed_groupEntity.name,
          bed_groupEntity.color,
          bed_groupEntity.description,
          bed_groupEntity.floor, 
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
    'update bed_group SET  name =? , color =? , description =? , floor =? where hospital_bed_group_id = ? and Hospital_id = ?',
    [
      bed_groupEntity.name,
      bed_groupEntity.color,
      bed_groupEntity.description,
      bed_groupEntity.floor,
      id,
      bed_groupEntity.Hospital_id
    ]
  )
  console.log("12345");

  
      return  [{"data ":{
      status:"success",
      "messege":"bed_group details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM bed_group WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update bed_group profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM bed_group WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
