import { Module } from '@nestjs/common';
import { OpdOutPatientService } from './opd-out_patient.service';
import { OpdOutPatientController } from './opd-out_patient.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  controllers: [OpdOutPatientController],
  providers: [OpdOutPatientService,DynamicDatabaseService],
})
export class OpdOutPatientModule {}
