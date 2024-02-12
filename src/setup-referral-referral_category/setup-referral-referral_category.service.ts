import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupReferralReferralCategory } from './entities/setup-referral-referral_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupReferralReferralCategoryService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 


  async create(referral_categoryEntity: SetupReferralReferralCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query( 'INSERT INTO referral_category (name,is_active) VALUES (?,?)',
      [referral_categoryEntity.name,
        referral_categoryEntity.is_active
       
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
     
      const AdminCategory = await dynamicConnection.query(`INSERT INTO referral_category (name,is_active,Hospital_id,hospital_referral_category_id) VALUES (?,?,?,?)`,[
        referral_categoryEntity.name,
        referral_categoryEntity.is_active,
        referral_categoryEntity.Hospital_id,


        result.insertId
      ]) 
      console.log("entering if",AdminCategory);
                await dynamicConnection.close();
  

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"referral_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM referral_category WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupReferralReferralCategory[]> {
    const referral_category = await this.connection.query('SELECT * FROM referral_category');
    return referral_category;
  }

  
  async findOne(id: string): Promise<SetupReferralReferralCategory | null> {
    const referral_category = await this.connection.query('SELECT * FROM referral_category WHERE id = ?', [id]);
    
    if (referral_category.length === 1) {
      return referral_category ;
    } else {
      return null;
    }
  }


  async update(id: string, referral_categoryEntity: SetupReferralReferralCategory): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE referral_category SET name =? WHERE id = ?',
        [referral_categoryEntity.name, 
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
    'update referral_category SET name = ?, is_active = ? where hospital_referral_category_id = ? and Hospital_id= ?',
  
    [referral_categoryEntity.name,
      referral_categoryEntity.is_active,
      id,
      referral_categoryEntity.Hospital_id
    ]
  
  );

  
      return  [{"data ":{
      status:"success",
      "messege":"referral_category details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM referral_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update referral_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM referral_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
