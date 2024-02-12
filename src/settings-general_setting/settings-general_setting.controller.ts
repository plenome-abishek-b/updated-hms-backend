import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsGeneralSettingService } from './settings-general_setting.service';
import { SettingsGeneralSetting } from './entities/settings-general_setting.entity';

@Controller('settings-general-setting')
export class SettingsGeneralSettingController {
  constructor(private readonly settingsGeneralSettingService: SettingsGeneralSettingService) {}

  @Post()
  create(@Body() general_settingEntity:SettingsGeneralSetting) {
    return this.settingsGeneralSettingService.create(general_settingEntity);
  }

  @Get()
  findAll() {
    return this.settingsGeneralSettingService.findall();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() general_settingEntity:SettingsGeneralSetting) {
    return this.settingsGeneralSettingService.update(id,general_settingEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsGeneralSettingService.remove(id);
  }
}
