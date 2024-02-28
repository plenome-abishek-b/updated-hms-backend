import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { HumanResourceStaff } from './entities/human_resource_staff.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
 
 
@Injectable()
export class HumanResourceStaffService {
  
 
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}
 
 
  async emailExists(email: string): Promise<boolean> {
    const result = await this.connection.query(
      `SELECT COUNT(*) AS count FROM staff WHERE email = ?`,
      [email]
    );
    return result[0].count > 0;
  }
 
 
 
  async  create(StaffEntity: HumanResourceStaff) {
 
    let dynamicConnection;
    try{
 
      const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
        process.env.ADMIN_IP,
        process.env.ADMIN_DB_NAME,
        process.env.ADMIN_DB_PASSWORD,
        process.env.ADMIN_DB_USER_NAME
        )
      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     
      dynamicConnection  = await createConnection(dynamicConnectionOptions);
 
      const emailExists = await this.emailExists(StaffEntity.email);
 
      if (emailExists) {
        console.log('Staff with this email already exists. Not inserting duplicate.');
        return;
      }
 
      let HRStaff_id ;
      const AddHRStaff = await this.connection.query(
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
          local_identification_number,
          Health_Professional_Registry,
          languagesKnown
          ) VALUES
         (?,?,?,?,?,?,?,?,?,?,?,?
          ,?,?,?,?,?,?,?,?,?,?,?,
          ?,?,?,?,?,?,?,?,?,?,?,?
          ,?,?,?,?,?,?,?,?,?,?,?,
          ?,?,?,?,?,?,?,?,?,?)`,
        [  StaffEntity.employee_id,
           StaffEntity.lang_id,
           StaffEntity.department_id,
           StaffEntity.staff_designation_id,
           StaffEntity.specialist,
           StaffEntity.qualification,       
           StaffEntity.work_exp,
           StaffEntity.specialization,
           StaffEntity.name,
           StaffEntity.surname,
           StaffEntity.father_name,
           StaffEntity.mother_name,
           StaffEntity.contact_no,
           StaffEntity.emergency_contact_no,
           StaffEntity.email,
           StaffEntity.dob,
           StaffEntity.marital_status,
           StaffEntity.date_of_joining,
           StaffEntity.date_of_leaving,
           StaffEntity.local_address,
           StaffEntity.permanent_address,
           StaffEntity.note,
           StaffEntity.image,
           StaffEntity.password,
           StaffEntity.gender,
           StaffEntity.blood_group,
           StaffEntity.account_title,
           StaffEntity.bank_account_no,
           StaffEntity.bank_name,
           StaffEntity.ifsc_code,
           StaffEntity.bank_branch,
           StaffEntity.payscale,
           StaffEntity.basic_salary,
           StaffEntity.epf_no,
           StaffEntity.contract_type,
           StaffEntity.shift,
           StaffEntity.location,
           StaffEntity.facebook,
           StaffEntity.twitter,
           StaffEntity.linkedin,
           StaffEntity.instagram,
           StaffEntity.resume,
           StaffEntity.joining_letter,
           StaffEntity.resignation_letter,
           StaffEntity.other_document_name,
           StaffEntity.other_document_file,
           StaffEntity.user_id,
           StaffEntity.is_active,
           StaffEntity.verification_code,
           StaffEntity.zoom_api_key,
           StaffEntity.zoom_api_secret,
           StaffEntity.pan_number,
           StaffEntity.identification_number,
           StaffEntity.local_identification_number,
           StaffEntity.Health_Professional_Registry,
           StaffEntity.languagesKnown
        ]
      );
     
          HRStaff_id = AddHRStaff.insertId;
          console.log(HRStaff_id,"staffffIdddd")
  
 
          let staff_roles_id ;
          try{
          const createRoles = await this.connection.query(
            `INSERT INTO staff_roles (role_id, staff_id, is_active) VALUES (?, ?, ?)`,
            [StaffEntity.role_id, AddHRStaff.insertId, StaffEntity.is_active],
          );
         
      staff_roles_id = createRoles.insertId;
      console.log(staff_roles_id,"idddrole")
 
 
    }catch(error){
      console.error('Error inserting data:', error);
    }
 
    console.log("StaffEntity.certificates",StaffEntity.certificates);
    
 
let cert =  await JSON.parse(JSON.stringify(StaffEntity.certificates))
console.log(cert,"111222333");
cert.forEach(async file => {
console.log(file.fileName,"file");
const createStaffCertifications =  await this.connection.query(
        `INSERT INTO staff_certifications (certificate_name,issued_year, staff_id, document) VALUES (?, ?, ?,?)`,
        [file.fileName,file.date,HRStaff_id, file.fileType],
      );
 
})
 
    
 
 
// #-----------------------------------------------------------------------#
 
 
    let HRDynamicStaffid;
 
    try{
 
      const getbloodgroup = await dynamicConnection.query('SELECT id FROM blood_bank_products WHERE hospital_blood_bank_products_id = ? and Hospital_id = ?', [StaffEntity.blood_group,StaffEntity.hospital_id]);
      const dynbloodgroup = getbloodgroup[0].id;
      console.log(dynbloodgroup,"dynbloodgroupid");
 
 
      const getdepartment = await dynamicConnection.query('SELECT id FROM department WHERE hospital_department_id = ? and Hospital_id = ?', [StaffEntity.department_id,StaffEntity.hospital_id]);
      const dyndepartment = getdepartment[0].id;
      console.log(dyndepartment,"dyndepartmentid");
 
 
      const getdesignation = await dynamicConnection.query('SELECT id FROM staff_designation WHERE hospital_staff_designation_id = ? and Hospital_id = ?', [StaffEntity.staff_designation_id,StaffEntity.hospital_id]);
      const dyndesignation = getdesignation[0].id;
      console.log(dyndesignation,"dyndesignationid");
 
 
      // const getspecialist = await dynamicConnection.query('SELECT id FROM specialist WHERE hospital_specialist_id = ? and Hospital_id = ?', [StaffEntity.specialist,StaffEntity.hospital_id]);
      // const dynspecialist = getspecialist[0].id;
      // console.log(dynspecialist,"dynspecialistid");
 
 
//       const getspecialist = await dynamicConnection.query('SELECT id FROM specialist WHERE hospital_specialist_id = ? and Hospital_id = ?', [StaffEntity.specialist, StaffEntity.hospital_id]);
// const dynspecialistRows = getspecialist.map((row) => row.id);
// const dynspecialist = JSON.stringify(dynspecialistRows);
 
// console.log(dynspecialist, "dynspecialistid");
 
const specialistIds = JSON.parse(StaffEntity.specialist);
const dynspecialistArray = [];
 
for (const specialistId of specialistIds) {
 
  console.log(specialistId,"specialistId");
  
 
const getspecialist = await dynamicConnection.query('SELECT id FROM specialist WHERE hospital_specialist_id = ? and Hospital_id = ?', [specialistId, StaffEntity.hospital_id]);
const dynspecialistRows = getspecialist.map((row) => row.id);
 
console.log(dynspecialistRows,"1111");
 
 
// Use a for loop to create a JSON array of specialists
for (const specialistId of dynspecialistRows) {
  const specialistData = await dynamicConnection.query('SELECT * FROM specialist WHERE id = ?', [specialistId]);
  console.log("dynspecialistArray",dynspecialistArray);
  
  dynspecialistArray.push(specialistData[0].id);
  console.log("specialistId",specialistId);
  
}
 
// Now, dynspecialistArray contains the specialist data in JSON format
// console.log(dynspecialistArray, "dynspecialistArray");
}
 
console.log(dynspecialistArray,"dynspecialistArraydynspecialistArraydynspecialistArraydynspecialistArray");
 
 
    const AddDynamicHRStaff = await dynamicConnection.query(
      `INSERT INTO staff (
        employee_id,
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
        local_identification_number,
        Health_Professional_Registry,
        languagesKnown
        ) VALUES
       (?,?,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,?,?
        ,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?)`,
      [  StaffEntity.employee_id,
         StaffEntity.lang_id,
         dyndepartment,
         dyndesignation,
         JSON.stringify(dynspecialistArray),
         StaffEntity.qualification,       
         StaffEntity.work_exp,
         StaffEntity.specialization,
         StaffEntity.name,
         StaffEntity.surname,
         StaffEntity.father_name,
         StaffEntity.mother_name,
         StaffEntity.contact_no,
         StaffEntity.emergency_contact_no,
         StaffEntity.email,
         StaffEntity.dob,
         StaffEntity.marital_status,
         StaffEntity.date_of_joining,
         StaffEntity.date_of_leaving,
         StaffEntity.local_address,
         StaffEntity.permanent_address,
         StaffEntity.note,
         StaffEntity.image,
         StaffEntity.gender,
         dynbloodgroup,
         StaffEntity.account_title,
         StaffEntity.bank_account_no,
         StaffEntity.bank_name,
         StaffEntity.ifsc_code,
         StaffEntity.bank_branch,
         StaffEntity.payscale,
         StaffEntity.basic_salary,
         StaffEntity.epf_no,
         StaffEntity.contract_type,
         StaffEntity.shift,
         StaffEntity.location,
         StaffEntity.facebook,
         StaffEntity.twitter,
         StaffEntity.linkedin,
         StaffEntity.instagram,
         StaffEntity.resume,
         StaffEntity.joining_letter,
         StaffEntity.resignation_letter,
         StaffEntity.other_document_name,
         StaffEntity.other_document_file,
         StaffEntity.user_id,
         StaffEntity.is_active,
         StaffEntity.verification_code,
         StaffEntity.zoom_api_key,
         StaffEntity.zoom_api_secret,
         StaffEntity.pan_number,
         StaffEntity.identification_number,
         StaffEntity.local_identification_number,
         StaffEntity.Health_Professional_Registry,
         StaffEntity.languagesKnown
      ]
    );
   
    HRDynamicStaffid = AddDynamicHRStaff.insertId;
        console.log(HRDynamicStaffid,"staffffIdddd")
        
 
      }catch(error){
        console.error('Error inserting dynamic staff data:', error);
      }
 
 
 
let staff_dynamic_hospital_staff_id;
     
 
        const [HOSStaff] = await dynamicConnection.query('select * from hospital_staffs where hospital_id = ? AND staff_id = ?',
    [StaffEntity.hospital_id,HRDynamicStaffid])
    
if( HOSStaff){
console.log("irukku");
 
}
else{
console.log("elseaeeeee");
 
  const createDynamicHospitalStaff = await dynamicConnection.query(
    `INSERT INTO hospital_staffs (hospital_id, staff_id,username,password) VALUES (?,?,?,?)`,
    [StaffEntity.hospital_id,HRDynamicStaffid,StaffEntity.email,StaffEntity.password],
  );
  console.log('hospital staff Data inserted successfully');
  staff_dynamic_hospital_staff_id = createDynamicHospitalStaff.insertId;
console.log(staff_dynamic_hospital_staff_id,"idddhospitalstaffrole")
 
 
}
 
 
let staff_dynamic_roles_id ;
      
const createDynamicRoles = await dynamicConnection.query(
  `INSERT INTO staff_roles (role_id, staff_id, hos_staff_role_id,hospital_id) VALUES (?, ?, ?, ?)`,
  [StaffEntity.role_id,HRDynamicStaffid,staff_roles_id,StaffEntity.hospital_id],
);
console.log('staff role Data inserted successfully');
staff_dynamic_roles_id = createDynamicRoles.insertId;
console.log(staff_dynamic_roles_id,"idddstaffrole")
 
 
 
let cert1 =  await JSON.parse(JSON.stringify(StaffEntity.certificates))
for (const file of cert1) {
  console.log(file.fileName, file.date, HRDynamicStaffid, file.fileType);
 
  await dynamicConnection.query(
    `INSERT INTO staff_certifications (certificate_name, issued_year, staff_id, document) VALUES (?, ?, ?, ?)`,
    [file.fileName, file.date, HRDynamicStaffid, file.fileType],
  );
}
 
 
 
 
 
 
if(dynamicConnection){
  console.log("111111");
  
  await dynamicConnection.close();
 
}
 
return  [{"data ":{
  status:"success",
  "messege":"Staff details added successfully ",
    "Added_Staff_Values":await this.connection.query('SELECT * FROM staff WHERE id = ?', [HRStaff_id])
  }}];
 
    
    }
 
 
 
    catch(error){
      if(dynamicConnection){
        await dynamicConnection.close();
 
      }
      console.error('Error while posting data:', error);
    }
  }
 
 
async findAll(): Promise<HumanResourceStaff[]> {
 
  const getStaffDetails = await this.connection.query(`SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,staff_roles.role_id AS StaffRoleID,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id
  WHERE staff.is_active = 1
  group by staff.id,staff.employee_id,staffname,StaffRoleID,role_name,designation,contact_no,department_name`);
  return getStaffDetails;
  
}
 
 
async findOne(id: string): Promise<HumanResourceStaff | null> {
  const getStaffByID = await this.connection.query(`SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id WHERE staff.id = ? and staff.is_active = 1
  group by staff.id,staff.employee_id,staffname,role_name,designation,contact_no,department_name `,[id]);
  
  if (getStaffByID.length === 1) {
    return getStaffByID;
  } else {
    return null;
  }
}
 
 
async findByRole(id: number): Promise<HumanResourceStaff | null> {
  const getStaffByRoleName = await this.connection.query(`SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id WHERE staff_roles.role_id = ? and staff.is_active = 1
  group by staff.id,staff.employee_id,staffname,role_name,designation,contact_no,department_name `,[id]);
  
    return getStaffByRoleName;
 
}
 
 
 
 
 
 
async update(id: number, StaffEntity: HumanResourceStaff) {
  let dynamicConnection;
 
  try {
    
  const [staffId] = await this.connection.query('SELECT email FROM staff WHERE id = ?', [id]);
  if (!staffId || staffId.length === 0) {
    throw new Error(`Staff with id: ${id} not found.`);
  }
 
  const email = staffId.email;
 
 
  
 
 
  const updateStaff = await this.connection.query(`update staff SET
   employee_id=?,
  lang_id=?,
  department_id=?,
  staff_designation_id=?,
  specialist=?,
  qualification=?,
  work_exp=?,
  specialization=?,
  name=?,
  surname=?,
  father_name=?,
  mother_name=?,
  contact_no=?,
  emergency_contact_no=?,
  dob=?,
  marital_status=?,
  date_of_joining=?,
  date_of_leaving=?,
  local_address=?,
  permanent_address=?,
  note=?,
  image=?,
  gender=?,
  blood_group=?,
  account_title=?,
  bank_account_no=?,
  bank_name=?,
  ifsc_code=?,
  bank_branch=?,
  payscale=?,
  basic_salary=?,
  epf_no=?,
  contract_type=?,
  shift=?,
  location=?,
  facebook=?,
  twitter=?,
  linkedin=?,
  instagram=?,
  resume=?,
  joining_letter=?,
  resignation_letter=?,
  other_document_name=?,
  other_document_file=?,
  user_id=?,
  is_active=?,
  verification_code=?,
  zoom_api_key=?,
  zoom_api_secret=?,
  pan_number=?,
  identification_number=?,
  local_identification_number=?,
  Health_Professional_Registry=?,
  languagesKnown=?
  where id=?`,
  [
    StaffEntity.employee_id,
     StaffEntity.lang_id,
     StaffEntity.department_id,
     StaffEntity.staff_designation_id,
     StaffEntity.specialist,
     StaffEntity.qualification,       
     StaffEntity.work_exp,
     StaffEntity.specialization,
     StaffEntity.name,
     StaffEntity.surname,
     StaffEntity.father_name,
     StaffEntity.mother_name,
     StaffEntity.contact_no,
     StaffEntity.emergency_contact_no,
     StaffEntity.dob,
     StaffEntity.marital_status,
     StaffEntity.date_of_joining,
     StaffEntity.date_of_leaving,
     StaffEntity.local_address,
     StaffEntity.permanent_address,
     StaffEntity.note,
     StaffEntity.image,
     StaffEntity.gender,
     StaffEntity.blood_group,
     StaffEntity.account_title,
     StaffEntity.bank_account_no,
     StaffEntity.bank_name,
     StaffEntity.ifsc_code,
     StaffEntity.bank_branch,
     StaffEntity.payscale,
     StaffEntity.basic_salary,
     StaffEntity.epf_no,
     StaffEntity.contract_type,
     StaffEntity.shift,
     StaffEntity.location,
     StaffEntity.facebook,
     StaffEntity.twitter,
     StaffEntity.linkedin,
     StaffEntity.instagram,
     StaffEntity.resume,
     StaffEntity.joining_letter,
     StaffEntity.resignation_letter,
     StaffEntity.other_document_name,
     StaffEntity.other_document_file,
     StaffEntity.user_id,
     StaffEntity.is_active,
     StaffEntity.verification_code,
     StaffEntity.zoom_api_key,
     StaffEntity.zoom_api_secret,
     StaffEntity.pan_number,
     StaffEntity.identification_number,
     StaffEntity.local_identification_number,
     StaffEntity.Health_Professional_Registry,
     StaffEntity.languagesKnown,
    id   
  ])
 
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
  );
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);
 
  const dynamicUpdateStaff = await dynamicConnection.query('SELECT id FROM staff WHERE email = ?', [email]);
 
console.log(dynamicUpdateStaff[0].id,"1234567890-");
 
const dynamicUPTDStaffId = dynamicUpdateStaff[0].id;
 
 
 
 
const uptgetbloodgroup = await dynamicConnection.query('SELECT id FROM blood_bank_products WHERE hospital_blood_bank_products_id = ? and Hospital_id = ?', [StaffEntity.blood_group,StaffEntity.hospital_id]);
  const uptdynbloodgroup = uptgetbloodgroup[0].id;
  console.log(uptdynbloodgroup,"dynbloodgroupid");
 
 
  const uptgetdepartment = await dynamicConnection.query('SELECT id FROM department WHERE hospital_department_id = ? and Hospital_id = ?', [StaffEntity.department_id,StaffEntity.hospital_id]);
  const uptdyndepartment = uptgetdepartment[0].id;
  console.log(uptdyndepartment,"dyndepartmentid");
 
 
  const uptgetdesignation = await dynamicConnection.query('SELECT id FROM staff_designation WHERE hospital_staff_designation_id = ? and Hospital_id = ?', [StaffEntity.staff_designation_id,StaffEntity.hospital_id]);
  const uptdyndesignation = uptgetdesignation[0].id;
  console.log(uptdyndesignation,"dyndesignationid");
 
 
  const specialistIds = JSON.parse(StaffEntity.specialist);
  const dynspecialistArray = [];
  
  for (const specialistId of specialistIds) {
  
    console.log(specialistId,"specialistId");
    
  
  const getspecialist = await dynamicConnection.query('SELECT id FROM specialist WHERE hospital_specialist_id = ? and Hospital_id = ?', [specialistId, StaffEntity.hospital_id]);
  const dynspecialistRows = getspecialist.map((row) => row.id);
  
  console.log(dynspecialistRows,"1111");
  
  
  // Use a for loop to create a JSON array of specialists
  for (const specialistId of dynspecialistRows) {
    const specialistData = await dynamicConnection.query('SELECT * FROM specialist WHERE id = ?', [specialistId]);
    console.log("dynspecialistArray",dynspecialistArray);
    
    dynspecialistArray.push(specialistData[0].id);
    console.log("specialistId",specialistId);
    
  }
  
  // Now, dynspecialistArray contains the specialist data in JSON format
  // console.log(dynspecialistArray, "dynspecialistArray");
  }
  
  console.log(dynspecialistArray,"dynspecialistArraydynspecialistArraydynspecialistArraydynspecialistArray");
 
 
 
const updateDynamicStaff = await dynamicConnection.query(`update staff SET
employee_id=?,
lang_id=?,
department_id=?,
staff_designation_id=?,
specialist=?,
qualification=?,
work_exp=?,
specialization=?,
name=?,
surname=?,
father_name=?,
mother_name=?,
contact_no=?,
emergency_contact_no=?,
dob=?,
marital_status=?,
date_of_joining=?,
date_of_leaving=?,
local_address=?,
permanent_address=?,
note=?,
image=?,
gender=?,
blood_group=?,
account_title=?,
bank_account_no=?,
bank_name=?,
ifsc_code=?,
bank_branch=?,
payscale=?,
basic_salary=?,
epf_no=?,
contract_type=?,
shift=?,
location=?,
facebook=?,
twitter=?,
linkedin=?,
instagram=?,
resume=?,
joining_letter=?,
resignation_letter=?,
other_document_name=?,
other_document_file=?,
user_id=?,is_active=?,
verification_code=?,
zoom_api_key=?,
zoom_api_secret=?,
pan_number=?,
identification_number=?,
local_identification_number=?,
Health_Professional_Registry=?,
languagesKnown=?
where id=?`,
  [
  StaffEntity.employee_id,
   StaffEntity.lang_id,
   uptdyndepartment,
     uptdyndesignation,
     JSON.stringify(dynspecialistArray),
   StaffEntity.qualification,       
   StaffEntity.work_exp,
   StaffEntity.specialization,
   StaffEntity.name,
   StaffEntity.surname,
   StaffEntity.father_name,
   StaffEntity.mother_name,
   StaffEntity.contact_no,
   StaffEntity.emergency_contact_no,
   StaffEntity.dob,
   StaffEntity.marital_status,
   StaffEntity.date_of_joining,
   StaffEntity.date_of_leaving,
   StaffEntity.local_address,
   StaffEntity.permanent_address,
   StaffEntity.note,
   StaffEntity.image,
   StaffEntity.gender,
   uptdynbloodgroup,
   StaffEntity.account_title,
   StaffEntity.bank_account_no,
   StaffEntity.bank_name,
   StaffEntity.ifsc_code,
   StaffEntity.bank_branch,
   StaffEntity.payscale,
   StaffEntity.basic_salary,
   StaffEntity.epf_no,
   StaffEntity.contract_type,
   StaffEntity.shift,
   StaffEntity.location,
   StaffEntity.facebook,
   StaffEntity.twitter,
   StaffEntity.linkedin,
   StaffEntity.instagram,
   StaffEntity.resume,
   StaffEntity.joining_letter,
   StaffEntity.resignation_letter,
   StaffEntity.other_document_name,
   StaffEntity.other_document_file,
   StaffEntity.user_id,
   StaffEntity.is_active,
   StaffEntity.verification_code,
   StaffEntity.zoom_api_key,
   StaffEntity.zoom_api_secret,
   StaffEntity.pan_number,
   StaffEntity.identification_number,
   StaffEntity.local_identification_number,
   StaffEntity.Health_Professional_Registry,
   StaffEntity.languagesKnown,
   dynamicUPTDStaffId
 
])
  await dynamicConnection.close();
  return  [{"data ":{
    status:"success",
    "messege":"Staff details updated successfully ",
    "updated_values":await this.connection.query('SELECT * FROM staff WHERE id = ?', [id])
    }}];
 
 
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
 
    }
    console.error('Error while posting data:', error);
  }
}
 
 
 
 
 
 
async disableStaff(id: number): Promise<HumanResourceStaff> {
  const staffMember = await this.connection.query('select * from staff where id = ?',[id])
  if (!staffMember) {
    throw new Error('Staff member not found');
  }
 
  const disable = await this.connection.query(`update staff set is_active = ? where id = ?`,[0,id])
  return await this.connection.query('select * from staff where id = ?',[id]);
}
 
 
 
async enableStaff(id: number): Promise<HumanResourceStaff> {
  const enablestaffMember = await this.connection.query('select * from staff where id = ?',[id])
  if (!enablestaffMember) {
    throw new Error('Staff member not found');
  }
 
  const enable = await this.connection.query(`update staff set is_active = ? where id = ?`,[1,id])
  return await this.connection.query('select * from staff where id = ?',[id]);
}
 
 
 
 
async remove(id: number,hospital_id:number): Promise<{ [key: string]: any }[]> {
  
  const staff = await this.connection.query('SELECT email FROM staff WHERE id = ?', [id]);
  if (!staff || staff.length === 0) {
    throw new Error(`Staff with id: ${id} not found.`);
  }
  
  const email = staff[0].email;
  
  const [getStaff_rolesId_from_hos] = await this.connection.query(`select id from staff_roles where staff_id = ?`,[id])
  let hos_staff_role_id = getStaff_rolesId_from_hos.id
  
  await this.connection.query('DELETE FROM staff_roles WHERE staff_id = ?', [id]);
  
  await this.connection.query('DELETE FROM staff WHERE id = ?', [id]);
  
  
 
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
  );
 
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
  const dynamicConnection = await createConnection(dynamicConnectionOptions);
 
  
  
  const dynamicStaff = await dynamicConnection.query('SELECT id FROM staff WHERE email = ?', [email]);
  if (!dynamicStaff || dynamicStaff.length === 0) {
    await dynamicConnection.close();
    throw new Error(`Staff with email: ${email} not found in the dynamic database.`);
  }
 
  const dynamicStaffId = dynamicStaff[0].id;
 
 
  
  await dynamicConnection.query('DELETE FROM hospital_staffs WHERE staff_id = ? AND hospital_id = ?', [dynamicStaffId,hospital_id]);
 
  
  await dynamicConnection.query('DELETE FROM staff_roles WHERE hos_staff_role_id = ? AND hospital_id = ?', [hos_staff_role_id,hospital_id]);
 
  
  
  await dynamicConnection.close();
 
  return [
    {
      status: 'success',
      message: `Staff with id: ${id} and associated entries in the dynamic database have been deleted.`,
    },
  ];
 
}
 
 
async findByStaffIdNameRole(search: string): Promise<HumanResourceStaff[]> {
console.log(search,"grdrgdjfm");
 
  let query = `SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id
`
let values = []
 
if(search){
  console.log(search,"1122112");
 
  query+= `WHERE (staff.id LIKE ? OR staff.name LIKE ? OR roles.name LIKE ? OR staff.employee_id LIKE ?) AND staff.is_active = 1 `
  values.push("%"+search+"%")
  values.push("%"+search+"%")
  values.push("%"+search+"%")
  values.push("%"+search+"%")
}
let last =  `group by staff.id,staff.employee_id,staffname,role_name,designation,contact_no,department_name`
 
let final =  query+last
console.log("idddddd",final)
const staffSearch = await this.connection.query(final,values);
 
return staffSearch;
 
  
}
 
 
 
 
 
 
async updateStaffPassword(id: number, StaffEntity: HumanResourceStaff) {
  let dynamicConnection;
 
  try {
    const [staffId] = await this.connection.query('SELECT email FROM staff WHERE id = ?', [id]);
    if (!staffId || staffId.length === 0) {
      throw new Error(`Staff with id: ${id} not found.`);
    }
  
    const email = staffId.email;
 
    
    const updatePrimaryPassword = await this.connection.query(
      'UPDATE staff SET password = ? WHERE id = ?',
      [StaffEntity.password, id]
    );
 
   
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
    );
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
    dynamicConnection = await createConnection(dynamicConnectionOptions);
 
    
    const [dynamicStaff] = await dynamicConnection.query('SELECT id FROM staff WHERE email = ?', [email]);
    if (!dynamicStaff || dynamicStaff.length === 0) {
      await dynamicConnection.close();
      throw new Error(`Staff with email: ${email} not found in the dynamic database.`);
    }
 
    const dynamicStaffId = dynamicStaff.id;
 
    
    const updateDynamicPassword = await dynamicConnection.query(
      'UPDATE staff SET password = ? WHERE id = ?',
      [StaffEntity.password, dynamicStaffId]
    );
 
 
    const [dynhosstaffid] = await dynamicConnection.query('SELECT id FROM hospital_staffs WHERE hospital_id = ? and staff_id = ?', [StaffEntity.hospital_id,dynamicStaffId]);
 
    const hospitalsstaffidd = dynhosstaffid.id;
    console.log(dynhosstaffid,"hospitalsstaffidd");
    
 
    const updateDynamichospitalStaffPassword = await dynamicConnection.query(
      'UPDATE hospital_staffs SET password = ? WHERE id = ?',
      [StaffEntity.password, hospitalsstaffidd]
    );
 
 
    await dynamicConnection.close();
 
    return [
      {
        data: {
          status: 'success',
          message: 'Staff password updated successfully.',
          updated_values: {
            primary_database: updatePrimaryPassword,
            dynamic_database: updateDynamicPassword,
            dynamic_hos_staff_database: updateDynamichospitalStaffPassword
          },
        },
      },
    ];
  } catch (error) {
    if (dynamicConnection) {
      await dynamicConnection.close();
    }
    console.error('Error while updating password:', error);
    throw new Error('Error while updating password.');
  }
}
 
 
 
 
async findAllDisableStaff(): Promise<HumanResourceStaff[]> {
 
  const getDisabledStaffDetails = await this.connection.query(`SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,staff_roles.role_id AS StaffRoleID,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id
  WHERE staff.is_active = 0
  group by staff.id,staff.employee_id,staffname,StaffRoleID,role_name,designation,contact_no,department_name`)
  return getDisabledStaffDetails;
  
}
 
 
 
async findByDisabledStaffRole(id: number): Promise<HumanResourceStaff | null> {
  const getDisabledStaffByRoleName = await this.connection.query(`SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
  LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
  LEFT JOIN roles ON staff_roles.role_id = roles.id
  LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
  LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
  LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
  LEFT JOIN department ON staff.department_id = department.id WHERE staff_roles.role_id = ? and staff.is_active = 0
  group by staff.id,staff.employee_id,staffname,role_name,designation,contact_no,department_name `,[id]);
  
    return getDisabledStaffByRoleName;
 
}
 
 
async findByDisabledStaffIdNameRole(search: string): Promise<HumanResourceStaff[]> {
  console.log(search,"grdrjjjkgdjfm");
  
    let query = `SELECT staff.* ,staff.id,staff.employee_id,CONCAT(staff.name, ' ', staff.surname) AS staffname,roles.name AS role_name,staff_designation.designation,staff.contact_no,department.department_name,group_concat(DISTINCT specialist.specialist_name),GROUP_CONCAT(DISTINCT languages.language) AS languagesknown FROM staff
    LEFT JOIN staff_roles ON staff.id = staff_roles.staff_id
    LEFT JOIN roles ON staff_roles.role_id = roles.id
    LEFT JOIN staff_designation ON staff.staff_designation_id = staff_designation.id
    LEFT JOIN specialist ON JSON_contains(staff.specialist,cast(specialist.id as JSON),'$')=1
    LEFT JOIN languages ON JSON_CONTAINS(staff.languagesKnown, CAST(languages.id AS JSON), '$') = 1
    LEFT JOIN department ON staff.department_id = department.id
  `
  let values = []
  
  if(search){
    console.log(search,"112288112");
  
    query+= `WHERE (staff.id LIKE ? OR staff.name LIKE ? OR roles.name LIKE ? OR staff.employee_id LIKE ?) AND staff.is_active = 0 `
    values.push("%"+search+"%")
    values.push("%"+search+"%")
    values.push("%"+search+"%")
    values.push("%"+search+"%")
   }
  let last =  `group by staff.id,staff.employee_id,staffname,role_name,designation,contact_no,department_name`
  
  let final =  query+last
  console.log("idddddd",final)
   const disabledStaffSearch = await this.connection.query(final,values);
   
   return disabledStaffSearch;
   
    
  }
 
 
 
}
 
 
 
 