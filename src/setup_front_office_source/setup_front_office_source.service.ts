import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupFrontOfficeSource } from './entities/setup_front_office_source.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupFrontOfficeSourceService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

 

  async create(sourceEntity: SetupFrontOfficeSource ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;
    try{
    const result = await this.connection.query(
      'INSERT INTO source (source,description) VALUES (?,?)',
      [sourceEntity.source,
        sourceEntity.description
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO source (source,description,Hospital_id,hospital_source_id) values(?,?,?,?)`,[
      sourceEntity.source,
      sourceEntity.description,
      sourceEntity.Hospital_id,
      result.insertId
    ])

    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"source details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM source WHERE id = ?', [result.insertId])
              }}];
  } catch(error){
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }
  }

 

  async findAll(): Promise<SetupFrontOfficeSource[]> {
    const source = await this.connection.query('SELECT * FROM source');
    return source ;
  }



  async findOne(id: string): Promise<SetupFrontOfficeSource | null> {
    const source = await this.connection.query('SELECT * FROM source WHERE id = ?', [id]);
    
    if (source.length === 1) {
      return  source;
    } else {
      return null;
    }
  }



  
  async update(id: string, sourceEntity: SetupFrontOfficeSource): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE source SET source =?, description = ? WHERE id = ?',
        [sourceEntity.source,
          sourceEntity.description,
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
        'update source SET  source =?, description = ? where hospital_source_id = ? and Hospital_id = ? ',
        [
          sourceEntity.source,
          sourceEntity.description,
          id,
          sourceEntity.Hospital_id
        ]
      )
      console.log("12345");

      return  [{"data ":{
      status:"success",
      "messege":"source details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM source WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "message":"cannot update source profile",
         "error":error
      }
      ]
    }
  }


  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM source WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
