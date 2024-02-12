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

    const [hoscharge_type] = await this.connection.query('select * from charge_type_master where charge_type = ?', [charges_entity.charge_type])
console.log("sssss",hoscharge_type)


   const [hoscharge_category] = await this.connection.query('select * from charge_categories where name = ?', [charges_entity.name])
console.log("zzzzz",hoscharge_category)


   const [hoscharge_name] = await this.connection.query('select * from charges where name = ?',[charges_entity.name])
  console.log("rrrrrr",hoscharge_name)

  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
  
    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
 
  dynamicConnection  = await createConnection(dynamicConnectionOptions);
 

let hoscharge_types;
const createcharges = await dynamicConnection.query(`insert into charges (name) values (?)`,[
  hoscharge_name[0].name
])
hoscharge_types = createcharges.insertId




let hoscharge_type_master:number

const charge_type_master = await dynamicConnection.query(`insert into charge_type_master (charge_type) values (?)`,[
  hoscharge_type[0].charge_type
])
hoscharge_type_master = charge_type_master.insertId


let hoscharge_categories:number;

const charge_categories = await dynamicConnection.query(`insert into charge_categories (name) values (?)`,[
  hoscharge_category[0].name
])

hoscharge_categories = charge_categories.insertId


} catch (error) {
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  }
}
}
  
  findAll() {
    return `This action returns all internalOpdCharges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} internalOpdCharge`;
  }

  update(id: number,  ) {
    return `This action updates a #${id} internalOpdCharge`;
  }

  remove(id: number) {
    return `This action removes a #${id} internalOpdCharge`;
  }
}
