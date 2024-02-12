import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupFrontOfficeComplainType } from './entities/setup_front_office_complain_type.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class SetupFrontOfficeComplainTypeService {

  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

 

  async create(complain_typeEntity: SetupFrontOfficeComplainType ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection
    try{
    const result = await this.connection.query(
      'INSERT INTO complaint_type (complaint_type,description) VALUES (?,?)',
      [complain_typeEntity.complaint_type,
        complain_typeEntity.description
       
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
   
    const AdminCategory = await dynamicConnection.query('INSERT INTO complaint_type (complaint_type,description,Hospital_id,hospital_complaint_type_id) VALUES (?,?,?,?)',[
      complain_typeEntity.complaint_type,
      complain_typeEntity.description,
      complain_typeEntity.Hospital_id,
      result.insertId
    ])
   
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"complaint_type details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }}


  async findAll(): Promise<SetupFrontOfficeComplainType[]> {
    const complaint_type = await this.connection.query('SELECT * FROM complaint_type');
    return complaint_type ;
  }



  async findOne(id: string): Promise<SetupFrontOfficeComplainType | null> {
    const complaint_type = await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [id]);
    
    // if (complaint_type.length === 1) {
      return complaint_type;
    // } else {
    //   return null;
    // }
  }

 
  async update(id: string, complain_typeEntity: SetupFrontOfficeComplainType): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE complaint_type SET complaint_type =?, description = ? WHERE id = ?',
        [complain_typeEntity.complaint_type,
          complain_typeEntity.description,
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
        'update complaint_type SET complaint_type =?, description = ? where hospital_complaint_type_id = ? and Hospital_id = ? ',
        [
          complain_typeEntity.complaint_type,
          complain_typeEntity.description,
          id,
          complain_typeEntity.Hospital_id
        ]
      );

      console.log("111");

      return  [{"data ":{
      status:"success",
      "messege":"complaint_type details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "message":"cannot update complaint_type profile",
         "error":error
      }
      ]
    }
  }


  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM complaint_type WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
