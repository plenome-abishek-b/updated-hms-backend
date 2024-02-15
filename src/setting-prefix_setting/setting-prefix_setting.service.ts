import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingPrefixSetting } from './entities/setting-prefix_setting.entity';

@Injectable()
export class SettingPrefixSettingService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(prefix_setting_entity:SettingPrefixSetting) {
    try{
 
      const result = await this.connection.query(`insert into prefixes (type,prefix) values (?,?)`,
      [prefix_setting_entity.type,
      prefix_setting_entity.prefix]
      );
 
      return  [{"data ":{"id  ":result.insertId,
      "status":"success",
      "messege":"prefixes details added successfully inserted",
      "inserted_data": await this.connection.query('SELECT * FROM prefixes WHERE id = ?', [result.insertId])
      }}];  ;
 
    }catch(error){
      await this.connection.close();
      return error
    }
  }

  async findall() {
    const prefix_setting = await this.connection.query(`select prefixes.id,prefixes.type, prefixes.prefix from prefixes`);
    return prefix_setting;
  }

  async update (id:string, SettingPrefixSettingServiceEntity:SettingPrefixSetting) {
    try {
const result = await this.connection.query(
  `update prefixes SET prefix = ? where id = ?`,
  [
    SettingPrefixSettingServiceEntity.prefix,
    id
  ]
)
console.log("rrrrrrr");
    

    return [{"data ":{
      status:"success",
      "messege":"prefixes details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM prefixes WHERE id = ?', [id])
      }}];
    }

    catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update finding_category profile",
         "error":error
      }
      ]
    }
  }

}
