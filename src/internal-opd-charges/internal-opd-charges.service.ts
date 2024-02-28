import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { InternalOpdCharge } from './entities/internal-opd-charge.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class InternalOpdChargesService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

async create (charges_entity:InternalOpdCharge) {
  let dynamicConnection;

  try{

    console.log("aaaaaaaaaa", charges_entity.opd_id );


    const result = await this.connection.query(
      `Insert into patient_charges (date,opd_id,qty,charge_id,standard_charge,
        tpa_charge,tax,apply_charge,amount,note)
      values (?,?,?,?,?,?,?,?,?,?)`,[
        charges_entity.date,
        charges_entity.opd_id,
        charges_entity.qty,
        charges_entity.charge_id,
        charges_entity.standard_charge,
        charges_entity.tpa_charge,
        charges_entity.tax,
        charges_entity.apply_charge,
        charges_entity.amount,
        charges_entity.note
      ]
    );
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
  
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    dynamicConnection  = await createConnection(dynamicConnectionOptions);
  
console.log("fffffffff");
console.log(charges_entity.Hospital_id,
  charges_entity.opd_id,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

const [opd_id] = await dynamicConnection.query(`select id from opd_details where Hospital_id = ? and hos_opd_id = ?`,
[charges_entity.Hospital_id,
charges_entity.opd_id])

console.log("aaaaawewee",opd_id)

const [charges] = await dynamicConnection.query(`select id from charges where Hospital_id = ? and hospital_charges_id = ?`,
[
  charges_entity.Hospital_id,
  charges_entity.charge_id
])
console.log("ttttt",charges);


try{
  const AdminCategory = await dynamicConnection.query(`insert into patient_charges(date,opd_id,qty,charge_id,standard_charge,
    tpa_charge,tax,apply_charge,amount,note,Hospital_id,hos_patient_charges_id) values (?,?,?,?,?,?,?,?,?,?,?,?)`,[
      charges_entity.date,
      opd_id.id,
      charges_entity.qty,
      charges.id,
      charges_entity.standard_charge,
      charges_entity.tpa_charge,
      charges_entity.tax,
      charges_entity.apply_charge,
      charges_entity.amount,
      charges_entity.note,
      charges_entity.Hospital_id,
      result.insertId
    ])

    console.log("kkkk")
} catch(error) {
  console.log(error)
}

await dynamicConnection.close();
return  [{"data ":{"id  ":result.insertId,
"status":"success",
"messege":"patient_charges details added successfully inserted",
}}];
}
catch (error) {
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }
  }
}
 





  
  async findAll(opd_id:number,patient_id:number) {
    const opd_charges = await this.connection.query(`select distinct patients.id, patient_charges.date,
    charges.name,
    patient_charges.note,
    charge_type_master.charge_type,
    charge_categories.name as charge_category,
    concat(patient_charges.qty," ",charge_units.unit)as qty,
    charges.standard_charge,
    organisations_charges.org_charge as TPA_charge,
    CONCAT(FORMAT(( (patient_charges.apply_charge /10)), 2), "(", tax_category.percentage, "%)") AS tax1,
    patient_charges.apply_charge as applied_charges,
    patient_charges.amount as amount from charges
    left join charge_categories on charges.charge_category_id = charge_categories.id
    left join charge_units on charges.charge_unit_id =  charge_units.id 
    left join organisations_charges on organisations_charges.charge_id = charges.id
    left join tax_category on charges.tax_category_id = tax_category.id
    left join charge_type_master on charge_type_master.id = charge_categories.charge_type_id
    left join patient_charges on patient_charges.charge_id = charges.id 
    left join opd_details on opd_details.id = patient_charges.opd_id
    left join patients on opd_details.patient_id = patients.id
    where opd_id = ? and patient_id = ?`,[opd_id,patient_id])
    return opd_charges;
  }

 async update(id:string,charges_entity:InternalOpdCharge ) {
  let dynamicConnection;
  try{
    const result = await this.connection.query(
      `update patient_charges SET qty = ?,date = ?,note =?, standard_charge = ?,tpa_charge = ?,
      apply_charge = ?, amount = ? , tax = ? where id = ?`,
      [
        charges_entity.qty,
        charges_entity.date,
        charges_entity.note,
        charges_entity.standard_charge,
        charges_entity.tpa_charge,
        charges_entity.apply_charge,
        charges_entity.amount,
        charges_entity.tax,
        id
      ]
    );
console.log("ffffff");

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
    )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    dynamicConnection = await createConnection(dynamicConnectionOptions);

    

    const repo = await dynamicConnection.query(
      `update patient_charges SET qty = ?,date = ?,note =?, standard_charge = ?,tpa_charge = ?,
      apply_charge = ?, amount = ? , tax = ? where hos_patient_charges_id = ? and Hospital_id = ?`,
      [
        charges_entity.qty,
        charges_entity.date,
        charges_entity.note,
        charges_entity.standard_charge,
        charges_entity.tpa_charge,
        charges_entity.apply_charge,
        charges_entity.amount,
        charges_entity.tax,
        id,
        charges_entity.Hospital_id
      ]
    )
    console.log("gggggg")
    return  [{"data ":{
    status:"success",
    "messege":"patient_charges details updated successfully ",
    "updated_values":await this.connection.query('SELECT * FROM patient_charges WHERE id = ?', [id])
    }}];
  } catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update patient_charges profile",
       "error":error
    }
    ]
  }
 }


 async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM patient_charges WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
}

}
