import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection } from 'typeorm';
import { SettingsGeneralSetting } from './entities/settings-general_setting.entity';

@Injectable()
export class SettingsGeneralSettingService {
  constructor(@InjectConnection() private connection: Connection){}
 

  async create(general_settingEntity:SettingsGeneralSetting) {
      const result = await this.connection.query(`insert into sch_settings (name,email,phone,address,start_month,
        session_id,lang_id,languages,dise_code,date_format,
        time_format,currency,currency_symbol,is_rtl,timezone,
        image,mini_logo,theme,credit_limit,opd_record_month,
        is_active,cron_secret_key, doctor_restriction,superadmin_restriction, patient_panel,
        mobile_api_url,app_primary_color_code,app_secondary_color_code,app_logo,zoom_api_key,
        zoom_api_secret) 
        values (?,?,?,?,?,
          ?,?,?,?,?,
          ?,?,?,?,?,
          ?,?,?,?,?,
          ?,?,?,?,?,
          ?,?,?,?,?,
          ?)`,
        [general_settingEntity.name,
          general_settingEntity.email,
          general_settingEntity.phone,
          general_settingEntity.address,
          general_settingEntity.start_month,
          general_settingEntity.session_id,
          general_settingEntity.lang_id,
          general_settingEntity.languages,
          general_settingEntity.dise_code,
          general_settingEntity.date_format,
          general_settingEntity.time_format,
          general_settingEntity.currency,
          general_settingEntity.currency_symbol,
          general_settingEntity.is_rtl,
          general_settingEntity.timezone,
          general_settingEntity.image,
          general_settingEntity.mini_logo,
          general_settingEntity.theme,
          general_settingEntity.credit_limit,
          general_settingEntity.opd_record_month,
          general_settingEntity.is_active,
          general_settingEntity.cron_secret_key,
          general_settingEntity.doctor_restriction,
          general_settingEntity.superadmin_restriction,
          general_settingEntity.patient_panel,
          general_settingEntity.mobile_api_url,
          general_settingEntity.app_primary_color_code,
          general_settingEntity.app_secondary_color_code,
          general_settingEntity.app_logo,
          general_settingEntity.zoom_api_key,
          general_settingEntity.zoom_api_secret
        ]);
console.log("sssssss");
        
        return  [{"data ":{"id  ":result.insertId,
        "status":"success",
        "messege":"sch_settings details added successfully inserted",
        "inserted_data": await this.connection.query('SELECT * FROM sch_settings WHERE id = ?', [result.insertId])
        }}]; 
    }

        async findall() {
       const general_setting = await this.connection.query(`select sch_settings.id,sch_settings.name, sch_settings.dise_code, sch_settings.address, sch_settings.phone, sch_settings.email,
       sch_settings.app_logo,sch_settings.mini_logo,
       languages.language,languages.is_rtl,
       sch_settings.date_format,sch_settings.timezone,
       sch_settings.currency,sch_settings.currency_symbol,sch_settings.credit_limit,sch_settings.time_format,
       sch_settings.mobile_api_url,sch_settings.app_primary_color_code,sch_settings.app_secondary_color_code,sch_settings.app_logo,
       sch_settings.doctor_restriction,sch_settings.superadmin_restriction,sch_settings.patient_panel,
       sch_settings.theme from sch_settings
       join languages on sch_settings.lang_id = languages.id`);
       return general_setting;
        }

        async update(id:string, general_settingEntity:SettingsGeneralSetting) {
          const result = await this.connection.query(
            `update sch_settings set name = ?,email =?,phone =?,address =?,start_month =?,
            session_id=?,lang_id=?, languages=?,dise_code=?,date_format=?,
            time_format=?, currency=?, currency_symbol=?,is_rtl=?,timezone=?,
            image=?,mini_logo=?, theme=?, credit_limit=?,opd_record_month=?,
            is_active=?,cron_secret_key=?,doctor_restriction=?, superadmin_restriction=?, patient_panel=?,
            mobile_api_url=?,app_primary_color_code=?, app_secondary_color_code=?,app_logo=?,zoom_api_key=?,
            zoom_api_secret=? 
            where id = ? `,
            [general_settingEntity.name,
              general_settingEntity.email,
              general_settingEntity.phone,
              general_settingEntity.address,
              general_settingEntity.start_month,
              general_settingEntity.session_id,
              general_settingEntity.lang_id,
              general_settingEntity.languages,
              general_settingEntity.dise_code,
              general_settingEntity.date_format,
              general_settingEntity.time_format,
              general_settingEntity.currency,
              general_settingEntity.currency_symbol,
              general_settingEntity.is_rtl,
              general_settingEntity.timezone,
              general_settingEntity.image,
              general_settingEntity.mini_logo,
              general_settingEntity.theme,
              general_settingEntity.credit_limit,
              general_settingEntity.opd_record_month,
              general_settingEntity.is_active,
              general_settingEntity.cron_secret_key,
              general_settingEntity.doctor_restriction,
              general_settingEntity.superadmin_restriction,
              general_settingEntity.patient_panel,
              general_settingEntity.mobile_api_url,
              general_settingEntity.app_primary_color_code,
              general_settingEntity.app_secondary_color_code,
              general_settingEntity.app_logo,
              general_settingEntity.zoom_api_key,
              general_settingEntity.zoom_api_secret,
              id

            ]
          )
          console.log("dddddddd");

          return [{"data":{
            status:"success",
            "message":"sch_settings updated successfully",
            "updated_values":await this.connection.query(`select * from sch_settings where id = ?`,[id])
          }}];
        }catch(error) {
          return [
            {
              status:"failed",
              "message":"cannot update sch_settings profile",
              "error":error
            }
          ]
        }
  
        
    


async remove(id:string) {
  const result = await this.connection.query('delete from sch_settings where id = ?',[id]);
  return [{
    "status":"success",
    "message":" id: "+ id + "deleted successfully"
  }
];
}

  }