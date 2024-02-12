import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import {RevertDischargePatientIpdModule} from './entities/revert_discharge_patient_ipd_module.entity'


@Injectable()
export class RevertDischargePatientIpdModuleService {

  constructor(@InjectConnection() private connection: Connection ,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 


  async create(RevertDischargePatientIpd: RevertDischargePatientIpdModule) {

try{



  
  let dynamicConnection;
  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
 
  dynamicConnection  = await createConnection(dynamicConnectionOptions);



    return;

  }catch(error){
    console.error('Error inserting data:', error);
  }
  
    }

  

  
}
