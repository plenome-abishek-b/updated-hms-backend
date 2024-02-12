import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsUsersStaffsService } from './settings-users-staffs.service';
import { SettingsUsersStaff } from './entities/settings-users-staff.entity';

@Controller('settings-users-staffs')
export class SettingsUsersStaffsController {
  constructor(private readonly settingsUsersStaffsService: SettingsUsersStaffsService) {}

 

  @Get()
  findAll() {
    return this.settingsUsersStaffsService.findall();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() SettingsUsersStaffEntity: SettingsUsersStaff) {
    return this.settingsUsersStaffsService.update(id,SettingsUsersStaffEntity );
  }

 
}
