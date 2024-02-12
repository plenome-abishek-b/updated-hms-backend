import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsModulesPatientService } from './settings-modules_patient.service';
import { SettingsModulesPatient } from './entities/settings-modules_patient.entity';

@Controller('settings-modules-patient')
export class SettingsModulesPatientController {
  constructor(private readonly settingsModulesPatientService: SettingsModulesPatientService) {}

 

  @Get()
  findAll() {
    return this.settingsModulesPatientService.findall();
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() ettingsModulesPatientEntity: SettingsModulesPatient) {
    return this.settingsModulesPatientService.update(id,ettingsModulesPatientEntity );
  }

 
}
