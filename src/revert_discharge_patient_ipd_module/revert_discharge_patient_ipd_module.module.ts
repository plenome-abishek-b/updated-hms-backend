import { Module } from '@nestjs/common';
import { RevertDischargePatientIpdModuleService } from './revert_discharge_patient_ipd_module.service';
import { RevertDischargePatientIpdModuleController } from './revert_discharge_patient_ipd_module.controller';
import {DynamicDatabaseService} from 'src/dynamic_db.service'

@Module({
  controllers: [RevertDischargePatientIpdModuleController],
  providers: [RevertDischargePatientIpdModuleService,DynamicDatabaseService],
})
export class RevertDischargePatientIpdModuleModule {}
