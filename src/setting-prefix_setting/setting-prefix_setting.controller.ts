import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingPrefixSettingService } from './setting-prefix_setting.service';
import { SettingPrefixSetting } from './entities/setting-prefix_setting.entity';

@Controller('setting-prefix-setting')
export class SettingPrefixSettingController {
  constructor(private readonly settingPrefixSettingService: SettingPrefixSettingService) {}

  @Post()
  create(@Body() prefix_setting_entity:SettingPrefixSetting) {
    return this.settingPrefixSettingService.create(prefix_setting_entity);
  }

  @Get()
  findAll() {
    return this.settingPrefixSettingService.findall();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() SettingPrefixSettingServiceEntity:SettingPrefixSetting) {
    return this.settingPrefixSettingService.update(id,SettingPrefixSettingServiceEntity );
  }

 
}
