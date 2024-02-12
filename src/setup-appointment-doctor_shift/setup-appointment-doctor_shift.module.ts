import { Module } from '@nestjs/common';
import { SetupAppointmentDoctorShiftService } from './setup-appointment-doctor_shift.service';
import { SetupAppointmentDoctorShiftController } from './setup-appointment-doctor_shift.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupAppointmentDoctorShift])],

  controllers: [SetupAppointmentDoctorShiftController],
  providers: [SetupAppointmentDoctorShiftService,DynamicDatabaseService],
})
export class SetupAppointmentDoctorShiftModule {}
