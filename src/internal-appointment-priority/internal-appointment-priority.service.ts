import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';
import { InternalAppointmentPriority } from './entities/internal-appointment-priority.entity';

@Injectable()
export class InternalAppointmentPriorityService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}
  

  
  async findAll(): Promise<InternalAppointmentPriority[]> {
    const appointment_priority = await this.connection.query('SELECT * FROM appoint_priority');
    return appointment_priority ;
  }

   
  async findOne(id: string): Promise<InternalAppointmentPriority | null> {
    const appointment_priority = await this.connection.query('SELECT * FROM appoint_priority WHERE id = ?', [id]);
    
    if (appointment_priority.length === 1) {
      return appointment_priority ;
    } else {
      return null;
    }
  }

  

 
}
