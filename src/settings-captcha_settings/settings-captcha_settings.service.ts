import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsCaptchaSetting } from './entities/settings-captcha_setting.entity';

@Injectable()
export class SettingsCaptchaSettingsService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findall() {
    const captcha_settings = await this.connection.query(`select * from captcha`);
    return captcha_settings;
  }

  async update(id:string, SettingsCaptchaSettingEntity:SettingsCaptchaSetting) {
    try{
const result = await this.connection.query(
  `update captcha set name = ?, status = ? where id = ?`,
  [
    SettingsCaptchaSettingEntity.name,
    SettingsCaptchaSettingEntity.status,
    id
  ]
)
console.log("ddddd");

return [{"data": {
  status:"success",
  "message":"captcha details updated successfully",
  "updated_values ":await this.connection.query(`select * from captcha where id = ?`, [id])
}}]

    } catch (error) {
      return [
        {status:"failed",
      "message":"cannot update captcha_settings profile",
      "error":error
      }
      ]
    }
  }
}
