import {Controller, Get, Post, Body, Patch, Param, Delete , Query} from '@nestjs/common';
import { RevertDischargePatientIpdModuleService } from './revert_discharge_patient_ipd_module.service';
import {RevertDischargePatientIpdModule} from './entities/revert_discharge_patient_ipd_module.entity'


@Controller('revert-discharge-patient-ipd-module')

export class RevertDischargePatientIpdModuleController {
  constructor(private readonly revertDischargePatientIpdModuleService: RevertDischargePatientIpdModuleService) {}

  @Post()
  create(@Body() RevertDischargePatientIpdModule: RevertDischargePatientIpdModule) {

    return this.revertDischargePatientIpdModuleService.create(RevertDischargePatientIpdModule);

  }


}
