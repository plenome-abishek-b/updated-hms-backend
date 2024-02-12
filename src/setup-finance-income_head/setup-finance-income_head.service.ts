import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupFinanceIncomeHead } from './entities/setup-finance-income_head.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupFinanceIncomeHeadService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

  async create(income_headEntity: SetupFinanceIncomeHead ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO income_head (income_category,description,is_active,is_deleted) VALUES (?,?,?,?)',
      [income_headEntity.income_category,
        income_headEntity.description,
        income_headEntity.is_active,
        income_headEntity.is_deleted
       
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
   
    const AdminCategory = await dynamicConnection.query('insert into income_head (income_category,description,is_active,is_deleted,Hospital_id,hospital_income_head_id) values (?,?,?,?,?,?)',[
      income_headEntity.income_category,
      income_headEntity.description,
      income_headEntity.is_active,
      income_headEntity.is_deleted,
      income_headEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"income_head details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM income_head WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }
 

  async findAll(): Promise<SetupFinanceIncomeHead[]> {
    const income_head = await this.connection.query('SELECT * FROM income_head');
    return income_head ;
  }

  async findOne(id: string): Promise<SetupFinanceIncomeHead | null> {
    const income_head = await this.connection.query('SELECT * FROM income_head WHERE id = ?', [id]);
    
    if (income_head.length === 1) {
      return income_head ;
    } else {
      return null;
    }
  }


  async update(id: string, income_headEntity: SetupFinanceIncomeHead  ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      
      const result = await this.connection.query(
        'UPDATE income_head SET income_category =?, description =? WHERE id = ?',
        [income_headEntity.income_category, 
          income_headEntity.description,
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
    'update income_head SET  income_category =?, description =? where hospital_income_head_id = ? and Hospital_id = ? ',
    [
      income_headEntity.income_category,
      income_headEntity.description,
      id,
      income_headEntity.Hospital_id
    ]
  );

  console.log("12345");

  
      return  [{"data ":{
      status:"success",
      "messege":"income_head details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM income_head WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update income_head profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM income_head WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
