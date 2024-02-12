import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsUsersPatientsService } from './settings-users_patients.service';
import { SettingsUsersPatient } from './entities/settings-users_patient.entity';

@Controller('settings-users-patients')
export class SettingsUsersPatientsController {
  constructor(private readonly settingsUsersPatientsService: SettingsUsersPatientsService) {}



  @Get()
  findAll() {
    return this.settingsUsersPatientsService.findall();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body()  SettingsUsersPatientEntity: SettingsUsersPatient) {
    return this.settingsUsersPatientsService.update(id,SettingsUsersPatientEntity );
  }

 
}
