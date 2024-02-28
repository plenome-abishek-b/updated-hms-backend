import { Module } from '@nestjs/common';
import { OpdOutPatientService } from './opd-out_patient.service';
import { OpdOutPatientController } from './opd-out_patient.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpdOutPatient } from './entities/opd-out_patient.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([OpdOutPatient])],

  controllers: [OpdOutPatientController],
  providers: [OpdOutPatientService,DynamicDatabaseService],
})
export class OpdOutPatientModule {}
