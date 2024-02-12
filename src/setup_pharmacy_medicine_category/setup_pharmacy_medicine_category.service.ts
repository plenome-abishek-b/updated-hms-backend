import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
// import { MedicineCategory } from './entities/medicine_category.entity';
import { SetupPharmacyMedicineCategory } from './entities/setup_pharmacy_medicine_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class MedicineCategoryService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(MedicineCategoryEntity: SetupPharmacyMedicineCategory ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO medicine_category (medicine_category) VALUES (?)',
      [MedicineCategoryEntity.medicine_category
       
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
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO medicine_category (medicine_category,Hospital_id,hospital_medicine_category_id) values (?,?,?)`,[
      MedicineCategoryEntity.medicine_category,
      MedicineCategoryEntity.Hospital_id,
      result.insertId
    ])
   
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"medicine_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
    return error
    }
    }
  }




  async findAll(): Promise<SetupPharmacyMedicineCategory[]> {
    const medicine_category = await this.connection.query('SELECT * FROM medicine_category');
    return medicine_category as SetupPharmacyMedicineCategory[];
  }

  
  async findOne(id: string): Promise<SetupPharmacyMedicineCategory | null> {
    const medicine_category = await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [id]);
    
    if (medicine_category.length === 1) {
      return medicine_category ;
    } else {
      return null;
    }
  }


  async update(id: string, MedicineCategoryEntity: SetupPharmacyMedicineCategory): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE medicine_category SET medicine_category =? WHERE id = ?',
        [MedicineCategoryEntity.medicine_category, 
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
    'update medicine_category SET medicine_category = ? where hospital_medicine_category_id =? and Hospital_id = ?',
    [
      MedicineCategoryEntity.medicine_category,
      id,
      MedicineCategoryEntity.Hospital_id
    ]
  )
    console.log("111111");
  
  
      return  [{"data ":{
      status:"success",
      "messege":"medicine_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}