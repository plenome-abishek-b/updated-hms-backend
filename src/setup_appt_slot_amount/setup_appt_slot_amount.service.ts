import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SetupApptSlotAmount } from './entities/setup_appt_slot_amount.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Injectable()
export class SetupApptSlotAmountService {

  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

async  create(slotEntity: SetupApptSlotAmount) {

  let dynamicConnection;
  try{
    console.log("aaa");
    
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    const dynamicConnection = await createConnection(dynamicConnectionOptions)
    console.log("aaa");

const [check] = await this.connection.query('select id from shift_details where staff_id = ?',[slotEntity.staff_id])

const [getStaffMail] = await this.connection.query(`select email from staff where id = ?`,[slotEntity.staff_id])
console.log("aaa",getStaffMail);

const [getAdminStaff] = await dynamicConnection.query(`select id from staff where email = ?`,[getStaffMail.email])



const [getAdminChargeId] = await dynamicConnection.query(`select id from charges 
where Hospital_id = ? and hospital_charges_id = ? `,[
  slotEntity.Hospital_id,
  slotEntity.charge_id
]) 

  if(check){  

    const update = this.connection.query(`
    update shift_details set 
    consult_duration = ? ,charge_id = ?
     where id = ? `,[
      slotEntity.consult_duration,
      slotEntity.charge_id,
      check.id,
     ])
     const [getAdminShift] = await dynamicConnection.query(`select id from shift_details
     where Hospital_id = ? and hospital_shift_details_id = ?`,[slotEntity.Hospital_id,check.id])

     const AdminUpdate = dynamicConnection.query(` 
     update shift_details set 
     consult_duration = ? ,charge_id = ?
      where id = ? `,[
        getAdminShift.id
      ])
    return  [{"data ":{
    "status":"success",
    "messege":"shift_details details updated successfully",
    }}]
  }
else{
 
  console.log("111");

  const insert = await this.connection.query(`insert into shift_details(staff_id,
    consult_duration,
    charge_id
    ) values (?,?,?)`,[
      slotEntity.staff_id,
      slotEntity.consult_duration,
      slotEntity.charge_id
    ])
console.log("111", getAdminStaff.id,
slotEntity.consult_duration,
getAdminChargeId.id,
slotEntity.Hospital_id,
insert.insertId);

  const AdminCategory = await dynamicConnection.query(`insert into shift_details(staff_id,
    consult_duration,
    charge_id,Hospital_id,hospital_shift_details_id) values (?,?,?,?,?)`,[
      getAdminStaff.id,
      slotEntity.consult_duration,
      getAdminChargeId.id,
      slotEntity.Hospital_id,
      insert.insertId
    ])

  
  return [{"data ":{"id  ":insert.insertId,
  "status":"success",
  "messege":"shift_details details added successfully inserted",
  "inserted_data": await this.connection.query('SELECT * FROM shift_details WHERE id = ?', [insert.insertId])
  }}];
}

}catch(error){
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }}
  if(dynamicConnection){
    await dynamicConnection.close();
  }
}

  

async  findforDocAndGlobalShift(staff_id:number) {
  const getCharge = await this.connection.query(`select shift_details.id, shift_details.consult_duration,charges.name charge_name,
  charges.charge_category_id,charges.id,charges.standard_charge,charge_categories.name charge_category_name
   from shift_details left join charges on charges.id = shift_details.charge_id
   left join charge_categories on charge_categories.id = charges.charge_category_id where shift_details.staff_id = ?`,
   [staff_id])
    return getCharge;
  }



async update(id: number, slotEntity: SetupApptSlotAmount) {
  console.log(slotEntity.consult_duration);
  
    const update = await this.connection.query(`update shift_details set consult_duration = ? ,charge_id = ? where id = ?`,[
      slotEntity.consult_duration,slotEntity.charge_id,id
    ])
    // return update;
    return  [{"data ":{
      status:"success",
      "message":"tax_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update tax_category module",
  }
  ]
}
  

async  remove(id: number) {
    const del = await this.connection.query('delete from shift_details where id = ?',[id])
    // return `This action removes a #${id} setupApptSlotAmount`;
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];

  }
}
