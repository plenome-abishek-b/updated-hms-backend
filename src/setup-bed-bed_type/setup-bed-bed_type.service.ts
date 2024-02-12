import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupBedBedType } from './entities/setup-bed-bed_type.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupBedBedTypeService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(bed_typeEntity: SetupBedBedType ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{
    const result = await this.connection.query(
      'INSERT INTO bed_type (name) VALUES (?)',
      [bed_typeEntity.name,
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERt INTO bed_type (name,Hospital_id,hospital_bed_type_id) values (?,?,?)',[
      bed_typeEntity.name,
      bed_typeEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"bed_type details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [result.insertId])
              }}];
  }
  catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupBedBedType[]> {
    const bed_type = await this.connection.query('SELECT * FROM bed_type');
    return bed_type ;
  }

  
  async findOne(id: string): Promise<SetupBedBedType | null> {
    const bed_type = await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [id]);
    
    if (bed_type.length === 1) {
      return bed_type ;
    } else {
      return null;
    }
  }


  async update(id: string, bed_typeEntity: SetupBedBedType): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE bed_type SET name =? WHERE id = ?',
        [bed_typeEntity.name, 
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
    'update bed_type SET name =? where hospital_bed_type_id = ? and Hospital_id= ?',

    [
      bed_typeEntity.name,
      id,
      bed_typeEntity.Hospital_id
    ]
  )
  
      return  [{"data ":{
      status:"success",
      "messege":"bed_type details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update bed_type profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM bed_type WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
