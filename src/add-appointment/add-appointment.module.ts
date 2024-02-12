import { Module } from '@nestjs/common';
import { AddAppointmentService } from './add-appointment.service';
import { AddAppointmentController } from './add-appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { AddAppointment } from './entities/add-appointment.entity';
 
@Module({
  imports:[ TypeOrmModule.forFeature([AddAppointment])],
 
  controllers: [AddAppointmentController],
  providers: [AddAppointmentService,DynamicDatabaseService],
})
export class AddAppointmentModule {}