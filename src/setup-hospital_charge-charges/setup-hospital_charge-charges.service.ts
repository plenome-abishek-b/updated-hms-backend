import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargeCharge } from './entities/setup-hospital_charge-charge.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupHospitalChargeChargesService {

  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(chargesEntity: SetupHospitalChargeCharge ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{

    console.log("aaaaaaaaaa", chargesEntity.name);


  const result = await this.connection.query(
    'INSERT INTO charges (charge_category_id,tax_category_id,charge_unit_id,name,standard_charge,date,description,status) VALUES (?,?,?,?,?,?,?,?)',
    [chargesEntity.charge_category_id,
      chargesEntity.tax_category_id,
      chargesEntity.charge_unit_id,
      chargesEntity.name,
      chargesEntity.standard_charge,
      chargesEntity.date,
      chargesEntity.description,
      chargesEntity.status
     
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
   console.log("ddddddwewee")
   const [charges1] = await dynamicConnection.query(`select id from charge_categories where Hospital_id = ? and hospital_charge_categories_id = ?`,
   [chargesEntity.Hospital_id,
   chargesEntity.charge_category_id
   ])

   const [charges2] = await dynamicConnection.query('select id from tax_category where Hospital_id = ? and hospital_tax_category_id = ?',
   [
    chargesEntity.Hospital_id,
    chargesEntity.tax_category_id
   ])

   const [charges3] = await dynamicConnection.query(`select id from charge_units where Hospital_id = ? and hospital_charge_units_id = ?`,
   [
    chargesEntity.Hospital_id,
    chargesEntity.charge_unit_id
   ])

   console.log("aaaaawewee",charges1,charges2,charges3)
try {
  const AdminCategory = await dynamicConnection.query(`insert into charges (charge_category_id,tax_category_id,charge_unit_id,name,
    standard_charge,date,description,status,Hospital_id,hospital_charges_id)
   values (?,?,?,?,?,?,?,?,?,?)`,[
    charges1.id,
    charges2.id,
    charges3.id,
        chargesEntity.name,
    chargesEntity.standard_charge,
    chargesEntity.date,
    chargesEntity.description,
    chargesEntity.status,
    chargesEntity.Hospital_id,
    result.insertId
  ])
  console.log("wewee")
  console.log("entering if",AdminCategory);

} catch (error) {
  console.log(error);
  
}


  await dynamicConnection.close();

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charges details added successfully inserted",
              // "inserted_data": await this.connection.query('SELECT * FROM charges WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupHospitalChargeCharge[]> {
    const charges = await this.connection.query('select charges.id,charges.name,charge_categories.name as charge_category,charge_type_master.charge_type,charge_units.unit,tax_category.percentage as tax, charges.standard_charge from charges  left join charge_categories ON charges.charge_category_id = charge_categories.id  left join charge_units ON charges.charge_unit_id = charge_units.id left join tax_category ON charges.tax_category_id = tax_category.id left join charge_type_master ON charge_type_master.id = charge_categories.charge_type_id;');
   console.log("vvvvvvv")
    return charges ;
  }

  
  async findOne(id: string): Promise<SetupHospitalChargeCharge | null> {
    const charges = await this.connection.query('select charges.id,charges.name,charge_categories.name as charge_category,charge_type_master.charge_type,charge_units.unit,tax_category.percentage as tax, charges.standard_charge from charges  left join charge_categories ON charges.charge_category_id = charge_categories.id  left join charge_units ON charges.charge_unit_id = charge_units.id left join tax_category ON charges.tax_category_id = tax_category.id left join charge_type_master ON charge_type_master.id = charge_categories.charge_type_id WHERE charges.id = ?', [id]);
    
    if (charges.length === 1) {
      return charges ;
    } else {
      return null;
    }
  }


  async update(id: string,chargesEntity: SetupHospitalChargeCharge): Promise<{ [key: string]: any }[]> {
let dynamicConnection;
    try {
      
      
      const result = await this.connection.query(
        'UPDATE charges SET charge_category_id =?,tax_category_id =? ,charge_unit_id =? ,name =? ,standard_charge =? ,date =? ,description =? ,status =?  WHERE id = ?',
        [chargesEntity.charge_category_id,
          chargesEntity.tax_category_id,
          chargesEntity.charge_unit_id,
          chargesEntity.name,
          chargesEntity.standard_charge,
          chargesEntity.date,
          chargesEntity.description,
          chargesEntity.status, 
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
    'update charges SET charge_category_id =?,tax_category_id =? ,charge_unit_id =? ,name =? ,standard_charge =? ,date =? ,description =? ,status =? where hospital_charges_id =? and Hospital_id =? ',
    [
      chargesEntity.charge_category_id,
      chargesEntity.tax_category_id,
      chargesEntity.charge_unit_id,
      chargesEntity.name,
      chargesEntity.standard_charge,
      chargesEntity.date,
      chargesEntity.description,
      chargesEntity.status,
      id,
      chargesEntity.Hospital_id
    ]
  )

  console.log("11111")
      return  [{"data ":{
      status:"success",
      "messege":"charges details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charges WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charges profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charges WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}