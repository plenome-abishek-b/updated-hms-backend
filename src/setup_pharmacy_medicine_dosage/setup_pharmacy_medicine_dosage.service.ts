import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPharmacyMedicineDosage } from './entities/setup_pharmacy_medicine_dosage.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupPharmacyMedicineDosageService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

  

  async create(Medicine_dosageEntity: SetupPharmacyMedicineDosage ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
 console.log("ssssssss")

    const result = await this.connection.query(
      'INSERT INTO medicine_dosage (medicine_category_id,dosage,charge_units_id) VALUES (?,?,?)',
      [Medicine_dosageEntity.medicine_category_id,
        Medicine_dosageEntity.dosage,
        Medicine_dosageEntity.charge_units_id,
       
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
   
const [medicine_category] = await dynamicConnection.query(`select id from medicine_category where Hospital_id = ? and hospital_medicine_category_id = ?`,
[
  Medicine_dosageEntity.Hospital_id,
  Medicine_dosageEntity.medicine_category_id
])

const [charge_units] = await dynamicConnection.query(`select id from charge_units where Hospital_id = ? and hospital_charge_units_id = ?`,
[
  Medicine_dosageEntity.Hospital_id,
  Medicine_dosageEntity.charge_units_id
])
console.log("ddddddd",medicine_category,charge_units);
try{
    const AdminCategory = await dynamicConnection.query('INSERT INTO medicine_dosage (medicine_category_id,dosage,charge_units_id,Hospital_id,hospital_medicine_dosage_id) values(?,?,?,?,?)',[
      medicine_category.id,
      Medicine_dosageEntity.dosage,
      charge_units.id,
            Medicine_dosageEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);


              await dynamicConnection.close();
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"medicine_dosage details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [result.insertId])
              }}];
            }catch (error){
              return error
            }
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close()
      return error
    }

    }
  }



  async findAll(): Promise<SetupPharmacyMedicineDosage[]> {
    const medicine_dosage = await this.connection.query('select medicine_dosage.id, medicine_dosage.dosage,charge_units.unit, medicine_category.medicine_category from medicine_dosage  join charge_units on charge_units.id = medicine_dosage.charge_units_id  join medicine_category on medicine_category.id = medicine_dosage.medicine_category_id');
    return medicine_dosage ;
  }


  async findOne(id: string): Promise<SetupPharmacyMedicineDosage | null> {
    const medicine_dosage = await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [id]);
    
    if (medicine_dosage.length === 1) {
      return medicine_dosage ;
    } else {
      return null;
    }
  }

  async update(id: string, Medicine_dosageEntity: SetupPharmacyMedicineDosage ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      
      const result = await this.connection.query(
        'UPDATE medicine_dosage SET medicine_category_id =?,dosage =?,charge_units_id =? WHERE id = ?',
        [Medicine_dosageEntity.medicine_category_id,
          Medicine_dosageEntity.dosage,
          Medicine_dosageEntity.charge_units_id, 
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
    'update medicine_dosage SET medicine_category_id =?,dosage =?,charge_units_id =? where hospital_medicine_dosage_id = ? and Hospital_id =? ',
    [
      Medicine_dosageEntity.medicine_category_id,
      Medicine_dosageEntity.dosage,
      Medicine_dosageEntity.charge_units_id,
      id,
      Medicine_dosageEntity.Hospital_id

    ]
  )

      return  [{"data ":{
      status:"success",
      "messege":"medicine_dosage details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_dosage profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_dosage WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
