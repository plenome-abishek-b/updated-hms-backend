import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsSystemNotificationSetting } from './entities/settings-system_notification_setting.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Injectable()
export class SettingsSystemNotificationSettingService {
  constructor(@InjectConnection() private connection: Connection
  ){}

  async findAll() {
    const system_notification = await this.connection.query(`select system_notification_setting.id,system_notification_setting.event,system_notification_setting.subject,system_notification_setting.is_staff,
    system_notification_setting.is_patient,system_notification_setting.is_active,system_notification_setting.staff_message,
    system_notification_setting.patient_message from system_notification_setting`);
    return system_notification;
  }

  async update (id:string, SettingsSystemNotificationSettingEntity: SettingsSystemNotificationSetting) {
    try {
      const result = await this.connection.query(
        `update system_notification_setting SET subject = ?, staff_message = ?, patient_message =? where id = ?`,
        [
          SettingsSystemNotificationSettingEntity.subject,
          SettingsSystemNotificationSettingEntity.staff_message,
          SettingsSystemNotificationSettingEntity.patient_message,
          id
        ]
      )
      console.log("ddddd");

      return  [{"data ":{
        status:"success",
        "messege":"system_notification_setting details updated successfully ",
        "updated_values":await this.connection.query('SELECT * FROM system_notification_setting WHERE id = ?', [id])
        }}];

    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update system_notification_setting profile",
         "error":error
      }
      ]
    }
  }

}
