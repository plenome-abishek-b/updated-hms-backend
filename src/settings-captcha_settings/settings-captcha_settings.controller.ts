import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsCaptchaSettingsService } from './settings-captcha_settings.service';
import { SettingsCaptchaSetting } from './entities/settings-captcha_setting.entity';

@Controller('settings-captcha-settings')
export class SettingsCaptchaSettingsController {
  constructor(private readonly settingsCaptchaSettingsService: SettingsCaptchaSettingsService) {}


  @Get()
  findAll() {
    return this.settingsCaptchaSettingsService.findall();
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body()  SettingsCaptchaSettingEntity:SettingsCaptchaSetting) {
    return this.settingsCaptchaSettingsService.update(id,SettingsCaptchaSettingEntity );
  }

}
