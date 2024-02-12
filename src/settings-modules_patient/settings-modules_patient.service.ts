import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsModulesPatient } from './entities/settings-modules_patient.entity';

@Injectable()
export class SettingsModulesPatientService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findall() {
    const modules_patient = await this.connection.query(`select permission_patient.id,permission_patient.name,permission_patient.is_active from permission_patient`)
    return modules_patient;
  }

  async update(id:string, SettingsModulesPatientEntity: SettingsModulesPatient) {
    try{
      const result = await this.connection.query(
        `update permission_patient SET is_active = ? where id = ?`,
        [
          SettingsModulesPatientEntity.is_active,
          id
        ]
      );
      console.log("dddd");

      return [{"date":{
        status:"success",
        "message":"permission_patient updated successfully",
        "updated_values":await this.connection.query(`select * from permission_patient where id = ?`, [id])
      }}];

    }catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update finding_category profile",
         "error":error
      }
      ]
    }
  }

}
