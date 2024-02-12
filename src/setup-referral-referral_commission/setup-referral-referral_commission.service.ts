import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupReferralReferralCommission } from './entities/setup-referral-referral_commission.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupReferralReferralCommissionService {
 
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(referral_commissionEntity: SetupReferralReferralCommission ){
   let dynamicConnection;
   try{
    const result = await this.connection.query('INSERT INTO referral_commission (referral_category_id,referral_type_id,commission,is_active) VALUES (?,?,?,?)',
      [referral_commissionEntity.referral_category_id,
        referral_commissionEntity.referral_type_id,
        referral_commissionEntity.commission,
        referral_commissionEntity.is_active       
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
   
const [referral_category] = await dynamicConnection.query(`select id from referral_category where Hospital_id = ? and hospital_referral_category_id = ?`,[
  referral_commissionEntity.Hospital_id,
  referral_commissionEntity.referral_category_id
])

const [referral_type] = await dynamicConnection.query(`select id from referral_type where Hospital_id = ? and hospital_referral_type_id = ?`,[
  referral_commissionEntity.Hospital_id,
  referral_commissionEntity.referral_type_id
])

console.log("sssss",referral_category,referral_type)

    const AdminCategory = await dynamicConnection.query(`INSERT INTO referral_commission (referral_category_id,referral_type_id,commission,is_active,Hospital_id,hospital_referral_commission_id) VALUES (?,?,?,?,?,?)`,[
      referral_category.id,
      referral_type.id,
      referral_commissionEntity.commission,
      referral_commissionEntity.is_active,
      referral_commissionEntity.Hospital_id,
      result.insertId
    ]) 
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();


              return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"referral_commission details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM referral_commission WHERE id = ?', [result.insertId])
              }}];
  }
 catch (error) {
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }
  }
 }



  async findAll(): Promise<SetupReferralReferralCommission[]> {
    const referral_commission = await this.connection.query(`select referral_commission.id, referral_category.name CATEGORY_NAME,referral_type.name TYPE_NAME,referral_commission.commission from referral_commission
    left join referral_category ON referral_commission.referral_category_id = referral_category.id
    left join referral_type ON referral_commission.referral_type_id = referral_type.id;`);
    return referral_commission ;
  }

  
 

  async update(id: string, referral_commissionEntity: SetupReferralReferralCommission ): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE referral_commission SET referral_type_id =?, commission =? WHERE id = ?',
        [referral_commissionEntity.referral_type_id,
          referral_commissionEntity.commission,
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
  'update referral_commission SET referral_type_id = ?, commission = ? where hospital_referral_commission_id = ? and Hospital_id= ?',

  [referral_commissionEntity.referral_type_id,
    referral_commissionEntity.commission,
    id,
    referral_commissionEntity.Hospital_id
  ]

);

console.log("12345");



      return  [{"data ":{
      status:"success",
      "messege":"referral_commission details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM referral_commission WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update referral_commission profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM referral_commission WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
