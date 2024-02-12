import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsUsersPatient } from './entities/settings-users_patient.entity';

@Injectable()
export class SettingsUsersPatientsService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findall() {
    const users_patients = await this.connection.query(`select users.id,users.user_id as patient_id,patients.patient_name,users.username,patients.mobileno,users.is_active as action from users 
    join patients on users.user_id = patients.id`);
    return users_patients;
  }

  async update(id:string, SettingsUsersPatientEntity: SettingsUsersPatient) {
    try{

      const result = await this.connection.query(
        'update users SET is_active = ? where id = ?',
        [SettingsUsersPatientEntity.is_active,
        id]
      );
      console.log("sssss");

      return  [{"data ":{
        status:"success",
        "messege":"users details updated successfully ",
        "updated_values":await this.connection.query('SELECT * FROM users WHERE id = ?', [id])
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
