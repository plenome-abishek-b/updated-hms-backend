import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingLanguage } from './entities/setting-language.entity';

@Injectable()
export class SettingLanguagesService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(setting_languageEntity:SettingLanguage) {
    try{
      const result = await this.connection.query('insert into languages (language,short_code,country_code) values (?,?,?)',
      [
        setting_languageEntity.language,
        setting_languageEntity.short_code,
        setting_languageEntity.country_code
      ]
      );

      return  [{"data ":{"id  ":result.insertId,
      "status":"success",
      "messege":"languages details added successfully inserted",
      "inserted_data": await this.connection.query('SELECT * FROM languages WHERE id = ?', [result.insertId])
      }}];  

    }catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update languages profile",
         "error":error
      }
      ]
    }
    
  }


  async findall() {
    const SettingLanguage = await this.connection.query(`select languages.id,languages.language,languages.short_code,languages.country_code,languages.is_deleted,
    languages.is_rtl,languages.is_active from languages `);
    return SettingLanguage;
  }

  async update(id:string, SettingLanguageEntity:SettingLanguage) {
    try {
      const result = await this.connection.query(
        `update languages SET is_deleted = ?, is_rtl = ?,is_active = ? where id = ?`,
        [
          SettingLanguageEntity.is_deleted,
          SettingLanguageEntity.is_rtl,
          SettingLanguageEntity.is_active,
          id
        ]
      );
      console.log("sssssssssss");

      return  [{"data ":{
        status:"success",
        "messege":"languages details updated successfully ",
        "updated_values":await this.connection.query('SELECT * FROM languages WHERE id = ?', [id])
        }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update languages profile",
         "error":error
      }
      ]
  }
  }
}
