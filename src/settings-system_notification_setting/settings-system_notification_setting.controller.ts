import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsSystemNotificationSettingService } from './settings-system_notification_setting.service';
import { SettingsSystemNotificationSetting } from './entities/settings-system_notification_setting.entity';

@Controller('settings-system-notification-setting')
export class SettingsSystemNotificationSettingController {
  constructor(private readonly settingsSystemNotificationSettingService: SettingsSystemNotificationSettingService) {}

 

  @Get()
  findAll() {
    return this.settingsSystemNotificationSettingService.findAll();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() SettingsSystemNotificationSettingEntity:SettingsSystemNotificationSetting) {
    return this.settingsSystemNotificationSettingService.update(id, SettingsSystemNotificationSettingEntity);
  }

}
