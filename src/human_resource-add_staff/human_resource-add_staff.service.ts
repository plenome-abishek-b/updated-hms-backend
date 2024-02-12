import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { HumanResourceAddStaff } from './entities/human_resource-add_staff.entity';

@Injectable()
export class HumanResourceAddStaffService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(add_staffEntity: HumanResourceAddStaff ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      `INSERT INTO staff (employee_id,
        lang_id,
        department_id,
        staff_designation_id,
        specialist,
        qualification,
        work_exp,
        specialization,
        name,
        surname,
        father_name,
        mother_name,
        contact_no,
        emergency_contact_no,
        email,
        dob,
        marital_status,
        date_of_joining,
        date_of_leaving,
        local_address,
        permanent_address,
        note,
        image,
        password,
        gender,
        blood_group,
        account_title,
        bank_account_no,
        bank_name,
        ifsc_code,
        bank_branch,
        payscale,
        basic_salary,
        epf_no,
        contract_type,
        shift,
        location,
        facebook,
        twitter,
        linkedin,
        instagram,
        resume,
        joining_letter,
        resignation_letter,
        other_document_name,
        other_document_file,
        user_id,
        is_active,
        verification_code,
        zoom_api_key,
        zoom_api_secret,
        pan_number,
        identification_number,
        local_identification_number) VALUES
       (?,?,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?)`,
      [  add_staffEntity.employee_id,
         add_staffEntity.lang_id,
         add_staffEntity.department_id,
         add_staffEntity.staff_designation_id,
         add_staffEntity.specialist, 
         add_staffEntity.qualification,       
         add_staffEntity.work_exp, 
         add_staffEntity.specialization, 
         add_staffEntity.name,
         add_staffEntity.surname,
         add_staffEntity.father_name,
         add_staffEntity.mother_name,
         add_staffEntity.contact_no,
         add_staffEntity.emergency_contact_no,
         add_staffEntity.email,
         add_staffEntity.dob,
         add_staffEntity.marital_status,
         add_staffEntity.date_of_joining,
         add_staffEntity.date_of_leaving,
         add_staffEntity.local_address,
         add_staffEntity.permanent_address,
         add_staffEntity.note,
         add_staffEntity.image,
         add_staffEntity.password,
         add_staffEntity.gender,
         add_staffEntity.blood_group,
         add_staffEntity.account_title,
         add_staffEntity.bank_account_no,
         add_staffEntity.bank_name,
         add_staffEntity.ifsc_code,
         add_staffEntity.bank_branch,
         add_staffEntity.payscale,
         add_staffEntity.basic_salary,
         add_staffEntity.epf_no,
         add_staffEntity.contract_type,
         add_staffEntity.shift,
         add_staffEntity.location,
         add_staffEntity.facebook,
         add_staffEntity.twitter,
         add_staffEntity.linkedin,
         add_staffEntity.instagram,
         add_staffEntity.resume,
         add_staffEntity.joining_letter,
         add_staffEntity.resignation_letter,
         add_staffEntity.other_document_name,
         add_staffEntity.other_document_file,
         add_staffEntity.user_id,
         add_staffEntity.is_active,
         add_staffEntity.verification_code,
         add_staffEntity.zoom_api_key,
         add_staffEntity.zoom_api_secret,
         add_staffEntity.pan_number,
         add_staffEntity.identification_number,
         add_staffEntity.local_identification_number
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"staff details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM staff WHERE id = ?', [result.insertId])
              }}];
  }

  async findAll(role_id): Promise<HumanResourceAddStaff[]> {
    const staff = await this.connection.query(`SELECT staff.id,staff.employee_id, CONCAT(staff.name, ' ', staff.surname) AS name, roles.name AS role_name, 
    staff_designation.designation, staff.contact_no, department.department_name
FROM staff 
LEFT JOIN staff_roles  ON staff.id = staff_roles.staff_id
LEFT JOIN roles  ON staff_roles.role_id = roles.id
LEFT JOIN staff_designation  ON staff.staff_designation_id = staff_designation.id
LEFT JOIN department  ON staff.department_id = department.id where staff_roles.role_id = ?`,[role_id]);


    return staff;
  }


  async findOne(id: string): Promise<HumanResourceAddStaff | null> {
    const staff = await this.connection.query(`SELECT * from staff WHERE id = ?`, [id]);
    
    if (staff.length === 1) {
      return staff;
    } else {
      return null;
    }
  }
 

  
  async update(id: string, add_staffEntity: HumanResourceAddStaff): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        `UPDATE staff SET employee_id =?, lang_id =?,department_id =?, staff_designation_id=?, specialist=?, qualification =?, 
        work_exp =? , specialization =?, name =?,surname =?,father_name =?,mother_name =?,contact_no =?,emergency_contact_no =?, 
        email =?,dob =?,marital_status =?,date_of_joining =?,date_of_leaving = ?,local_address =?,permanent_address =?,note =?,image =?,
        password =?,gender =?,blood_group =?,account_title =?,bank_account_no =?,bank_name =?,ifsc_code =?,bank_branch =?,payscale =?,
          basic_salary =?,epf_no =?,contract_type =?,shift =?, location =?,facebook =?,twitter =?,linkedin =?,instagram =?,resume =?,
          joining_letter =?,resignation_letter =?,  other_document_name =?,other_document_file =?,user_id =?,is_active =?,
          verification_code =?,zoom_api_key =?,zoom_api_secret =?,pan_number =?,
        identification_number =?,local_identification_number=?,created_at=? WHERE id = ?`,
        [add_staffEntity.employee_id, 
          add_staffEntity.lang_id,
          add_staffEntity.department_id,
          add_staffEntity.staff_designation_id,
          add_staffEntity.specialist,
          add_staffEntity.qualification,
          add_staffEntity.work_exp,
          add_staffEntity.specialization,
          add_staffEntity.name,
          add_staffEntity.surname,
          add_staffEntity.father_name,
          add_staffEntity.mother_name,
          add_staffEntity.contact_no,
          add_staffEntity.emergency_contact_no,
          add_staffEntity.email,
          add_staffEntity.dob,
          add_staffEntity.marital_status,
          add_staffEntity.date_of_joining,
          add_staffEntity.date_of_leaving,
          add_staffEntity.local_address,
          add_staffEntity.permanent_address,
          add_staffEntity.note,
          add_staffEntity.image,
          add_staffEntity.password,
          add_staffEntity.gender,
          add_staffEntity.blood_group,
          add_staffEntity.account_title,
          add_staffEntity.bank_account_no,
          add_staffEntity.bank_name,
          add_staffEntity.ifsc_code,
          add_staffEntity.bank_branch,
          add_staffEntity.payscale,
          add_staffEntity.basic_salary,
          add_staffEntity.epf_no,
          add_staffEntity.contract_type,
          add_staffEntity.shift,
          add_staffEntity.location,
          add_staffEntity.facebook,
          add_staffEntity.twitter,
          add_staffEntity.linkedin,
          add_staffEntity.instagram,
          add_staffEntity.resume,
          add_staffEntity.joining_letter,
          add_staffEntity.resignation_letter,
          add_staffEntity.other_document_name,
          add_staffEntity.other_document_file,
          add_staffEntity.user_id,
          add_staffEntity.is_active,
          add_staffEntity.verification_code,
          add_staffEntity.zoom_api_key,
          add_staffEntity.zoom_api_secret,
          add_staffEntity.pan_number,
          add_staffEntity.identification_number,
          add_staffEntity.local_identification_number,
          add_staffEntity.created_at,
          id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"staff details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM staff WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {"data":{
          status:"failed",
         "messege":"cannot update staff profile",
         "error":error
         } }
      ]
    }
  }


  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM staff WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
