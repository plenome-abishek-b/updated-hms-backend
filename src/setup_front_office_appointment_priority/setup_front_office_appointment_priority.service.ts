import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFrontOfficeAppointmentPriority } from './entities/setup_front_office_appointment_priority.entity';

@Injectable()

export class SetupFrontOfficeAppointmentPriorityService {
  constructor(@InjectConnection() private connection: Connection) {}

 async create(appointment_priority: SetupFrontOfficeAppointmentPriority ): Promise<{[key: string]: any}[]> {
    const result = await this.connection.query(
      'INSERT INTO appoint_priority (priority_status) VALUES (?)',
      [appointment_priority.priority_status]
    );
    

    return [{"data ":{"id  ":result.insertId,
    "status":"success",
    "messege":"appointment_priority details added successfully inserted",
    "inserted_data": await this.connection.query('SELECT * FROM appoint_priority WHERE id = ?', [result.insertId])
    }}];
  }



  async findAll() {
    const appoint_priority = await this.connection.query('select * FROM appoint_priority');
    return appoint_priority;
  }

 async findOne(id: number) {
    const appoint_priority = await this.connection.query('select * from appoint_priority where id = ?',[id]);
    return appoint_priority;
  }

  async update(id: number, appoint_priorityEntity : SetupFrontOfficeAppointmentPriority): Promise<{ [key:string]: any}[]>  {
    try {
      const result = await this.connection.query(
        'update appoint_priority SET priority_status = ? where id = ?',
        [appoint_priorityEntity.priority_status,
          id
  
        ]
      );
      return  [{"data ":{
        status:"success",
        "message":"appointment_priority details updated successfully inserted",
        "updated_values":await this.connection.query('SELECT * FROM appoint_priority WHERE id = ?', [id])
      }}];
  } catch (error) {
    return [
        {status:"failed",
  "message":"cannot update appoint_priority module",
    }
    ]
  }
   }

 
   async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM appoint_priority WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
