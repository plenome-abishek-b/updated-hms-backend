import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { FindingsCategory } from './entities/findings_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class FindingsCategoryService { 
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 


        
  async create(findings_categoryEntity: FindingsCategory) {
    let dynamicConnection
    try {
      
    const result = await this.connection.query( 'INSERT INTO finding_category (category) VALUES (?)',
    [findings_categoryEntity.category]   );

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
 
  const AdminCategory = await dynamicConnection.query(`INSERT INTO finding_category (category,Hospital_id,hospital_finding_category_id) VALUES (?,?,?)`,[
    findings_categoryEntity.category,
    findings_categoryEntity.Hospital_id,
    result.insertId
  ])  
  console.log("entering if",AdminCategory);
            await dynamicConnection.close();

            return  [{"data ":{"id  ":result.insertId,
            "status":"success",
            "messege":"finding_category details added successfully inserted",
            "inserted_data": await this.connection.query('SELECT * FROM finding_category WHERE id = ?', [result.insertId])
            }}];  

    } catch (error) {
      if(dynamicConnection){
        await dynamicConnection.close();
        return error
      }
    }
  }



  async findAll(): Promise<FindingsCategory[]> {
    const finding_category = await this.connection.query('SELECT * FROM finding_category');
    return finding_category ;
  }

   
  async findOne(id: string): Promise<FindingsCategory | null> {
    const finding_category = await this.connection.query('SELECT * FROM finding_category WHERE id = ?', [id]);
    
    if (finding_category.length === 1) {
      return finding_category ;
    } else {
      return null;
    }
  }


  async update(id: string, findings_categoryEntity: FindingsCategory): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE finding_category SET category =? WHERE id = ?',
        [findings_categoryEntity.category, 
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

const repo =  await dynamicConnection.query(
  'update finding_category SET category = ? where hospital_finding_category_id = ? and Hospital_id= ?',

  [findings_categoryEntity.category,
    id,
    findings_categoryEntity.Hospital_id
  ]

);

console.log("12345");



      return  [{"data ":{
      status:"success",
      "messege":"finding_category details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM finding_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update finding_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM finding_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
