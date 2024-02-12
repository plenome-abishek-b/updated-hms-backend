import { Module } from '@nestjs/common';
import { SettingsGeneralSettingService } from './settings-general_setting.service';
import { SettingsGeneralSettingController } from './settings-general_setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsGeneralSetting } from './entities/settings-general_setting.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SettingsGeneralSetting])],

  controllers: [SettingsGeneralSettingController],
  providers: [SettingsGeneralSettingService],
})
export class SettingsGeneralSettingModule {}
