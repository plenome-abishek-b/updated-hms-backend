import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupFindingsFinding } from './entities/setup-findings-finding.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupFindingsFindingService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(findingEntity: SetupFindingsFinding ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{

   
    const result = await this.connection.query(
      'INSERT INTO finding (name,description,finding_category_id) VALUES (?,?,?)',
      [findingEntity.name,
        findingEntity.description,
        findingEntity.finding_category_id,
       
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
   
const [finding_category] = await dynamicConnection.query(`select id from finding_category where Hospital_id = ? and hospital_finding_category_id = ?`,[
  findingEntity.Hospital_id,
  findingEntity.finding_category_id
])

    const AdminCategory = await dynamicConnection.query('insert into finding (name,description,finding_category_id,Hospital_id,hospital_finding_id) values (?,?,?,?,?)',[
      findingEntity.name,
      findingEntity.description,
      finding_category.id,
            findingEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"finding details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM finding WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupFindingsFindingService[]> {
    const finding = await this.connection.query(`select finding.id,finding.name,finding.description,finding_category.category from finding 
    join finding_category ON finding.finding_category_id = finding_category.id`);
    return finding ;
  }

  
  async findOne(id: string): Promise<SetupFindingsFindingService | null> {
    const finding = await this.connection.query(`select finding.id,finding.name,finding.description,finding_category.category from finding 
    join finding_category ON finding.finding_category_id = finding_category.id WHERE finding.id = ?`, [id]);
    
    if (finding.length === 1) {
      return finding ;
    } else {
      return null;
    }
  }

  async update(id: string, findingEntity: SetupFindingsFinding): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE finding SET name =?,description =?,finding_category_id =?  WHERE id = ?',
        [findingEntity.name, 
          findingEntity.description,
          findingEntity.finding_category_id,
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
  'update finding SET  name =?,description =?,finding_category_id =? where hospital_finding_id = ? and Hospital_id = ?',
  [
    findingEntity.name,
    findingEntity.description,
    findingEntity.finding_category_id,
    id,
    findingEntity.Hospital_id
  ]
  )
  console.log("aaaaa");
  
  
      return  [{"data ":{
      status:"success",
      "message":"finding details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM finding WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update finding profile",
         "error":error
      }
      ]
    }
  }
  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM finding WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}