import { Module } from '@nestjs/common';
import { SetupAppointmentShiftService } from './setup-appointment-shift.service';
import { SetupAppointmentShiftController } from './setup-appointment-shift.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupAppointmentShift } from './entities/setup-appointment-shift.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupAppointmentShift])],

  controllers: [SetupAppointmentShiftController],
  providers: [SetupAppointmentShiftService,DynamicDatabaseService],
})
export class SetupAppointmentShiftModule {}
