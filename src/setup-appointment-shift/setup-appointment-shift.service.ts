import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupAppointmentShift } from './entities/setup-appointment-shift.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupAppointmentShiftService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 
  
  async create(appointment_shiftEntity: SetupAppointmentShift ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO global_shift (name,start_time,end_time) VALUES (?,?,?)',
      [appointment_shiftEntity.name,
        appointment_shiftEntity.start_time,
        appointment_shiftEntity.end_time
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
   const AdminCategory = await dynamicConnection.query(`INSERT INTO global_shift (name,start_time,end_time,Hospital_id,hospital_global_shift_id) values (?,?,?,?,?)`,[
    appointment_shiftEntity.name,
    appointment_shiftEntity.start_time,
    appointment_shiftEntity.end_time,
    appointment_shiftEntity.Hospital_id,
    result.insertId
   ])
   console.log('ssssss',AdminCategory);
   await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"global_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupAppointmentShift[]> {
    const global_shift = await this.connection.query('SELECT * FROM global_shift');
    return global_shift ;
  }

  
  async findOne(id: string): Promise<SetupAppointmentShift | null> {
    const global_shift = await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [id]);
    
    if (global_shift.length === 1) {
      return global_shift ;
    } else {
      return null;
    }
  }


  async update(id: string, appointment_shiftEntity: SetupAppointmentShift): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE global_shift SET name =? ,start_time =?, end_time =? WHERE id = ?',
        [appointment_shiftEntity.name,
          appointment_shiftEntity.start_time,
          appointment_shiftEntity.end_time, 
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
  const dynamicConnection = await createConnection(dynamicConnectionOptions);

  const repo = await dynamicConnection.query(
    'update global_shift SET name =? ,start_time =?, end_time =? where hospital_global_shift_id =? and Hospital_id = ?',
    [appointment_shiftEntity.name,
    appointment_shiftEntity.start_time,
    appointment_shiftEntity.end_time,
  id,
appointment_shiftEntity.Hospital_id
]
  )
  console.log("1111111");
  
  
      return  [{"data ":{
      status:"success",
      "messege":"global_shift details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update global_shift profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM global_shift WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
