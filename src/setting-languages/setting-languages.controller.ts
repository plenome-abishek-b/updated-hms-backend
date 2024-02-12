import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingLanguagesService } from './setting-languages.service';
import { SettingLanguage } from './entities/setting-language.entity';

@Controller('setting-languages')
export class SettingLanguagesController {
  constructor(private readonly settingLanguagesService: SettingLanguagesService) {}

  @Post()
  create(@Body() setting_languageEntity:SettingLanguage) {
    return this.settingLanguagesService.create(setting_languageEntity);
  }

  @Get()
  findAll() {
    return this.settingLanguagesService.findall();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() setting_languageEntity:SettingLanguage) {
    return this.settingLanguagesService.update(id, setting_languageEntity);
  }


  
}
