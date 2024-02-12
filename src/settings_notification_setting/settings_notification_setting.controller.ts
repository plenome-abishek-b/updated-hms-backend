import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsNotificationSettingService } from './settings_notification_setting.service';
import { SettingsNotificationSetting } from './entities/settings_notification_setting.entity';

@Controller('settings-notification-setting')
export class SettingsNotificationSettingController {
  constructor(private readonly settingsNotificationSettingService: SettingsNotificationSettingService) {}



  @Get()
  findAll() {
    return this.settingsNotificationSettingService.findAll();
  }

 
  @Patch(':id')
  update(@Param('id') id: string, @Body() SettingsNotificationSettingEntity: SettingsNotificationSetting) {
    return this.settingsNotificationSettingService.update(id, SettingsNotificationSettingEntity);
  }

  
}
