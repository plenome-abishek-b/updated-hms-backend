import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsNotificationSetting } from './entities/settings_notification_setting.entity';

@Injectable()
export class SettingsNotificationSettingService {
  constructor(@InjectConnection() private connection: Connection) {}

async findAll() {
  const notification_setting = await this.connection.query(`select notification_setting.id, notification_setting.type,notification_setting.is_mail,notification_setting.is_sms,notification_setting.is_mobileapp,
  notification_setting.template_id,notification_setting.template from notification_setting`);
  return notification_setting;
}

async update(id:string, SettingsNotificationSettingEntity: SettingsNotificationSetting) {
  let dynamicConnection;
  try {
    const result = await this.connection.query(
      `update notification_setting SET type = ?, template_id = ?, template = ?, is_mail = ?, is_sms = ?, is_mobileapp =?, subject=? where id = ?`,
      [
        SettingsNotificationSettingEntity.type,
        SettingsNotificationSettingEntity.template_id,
        SettingsNotificationSettingEntity.template,
        SettingsNotificationSettingEntity.is_mail,
        SettingsNotificationSettingEntity.is_sms,
        SettingsNotificationSettingEntity.is_mobileapp,
        SettingsNotificationSettingEntity.subject,
                id
      ]
    )
    console.log("sssssss");

    return [{"data": {
      status:"success",
      "message":"setting_notification details updated successfully",
      "updated_values":await this.connection.query('select * from notification_setting where id = ?', [id])
    }}]

  } catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update finding_category profile",
       "error":error
    }
    ]
  }
}

}
