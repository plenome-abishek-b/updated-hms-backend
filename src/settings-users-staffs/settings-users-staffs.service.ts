import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SettingsUsersStaff } from './entities/settings-users-staff.entity';

@Injectable()
export class SettingsUsersStaffsService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findall() {
    const users_staff = await this.connection.query(`select staff.id,staff.employee_id as staff_ID, staff.name,staff.email,roles.name as role,staff_designation.designation,department.department_name,
    staff.contact_no as phone ,staff.is_active from staff
    join staff_roles on staff_roles.staff_id = staff.id
    join roles on staff_roles.role_id = roles.id
    join staff_designation on staff.staff_designation_id = staff_designation.id
    join department on staff.department_id = department.id`);
    return users_staff;
  }

  async update(id:string, SettingsUsersStaffEntity: SettingsUsersStaff ) {
    try{
      const result = await this.connection.query(
        `update staff SET is_active = ? where id = ?`,
        [
          SettingsUsersStaffEntity.is_active,
          id
        ]
      );
      console.log("dddd");

      return [{"data": {
        status:"success",
        "message":"users_staff details updated successfully",
        "updated_values":await this.connection.query(`select * from users where id = ?`, [id])
      }}]
    }catch (error) {
      return [
        {status:"failed",
      "message":"cannot update users_staff profile",
    "error":error
    }
      ]
    }
  }
}
