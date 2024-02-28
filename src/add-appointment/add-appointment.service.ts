import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { AddAppointment } from './entities/add-appointment.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
 
@Injectable()
export class AddAppointmentService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}
 
  async  create(AppointmentEntity: AddAppointment) {
    let dynamicConnection;
    try {
     
    // const privateKey = await this.generatePublicKey();
 
    const HOSpatient = await this.connection.query('select * from patients where id =?',[AppointmentEntity.patient_id] )
    console.log(HOSpatient,".........");
 
    let HOspatientmobileno = HOSpatient[0].mobileno
    console.log(HOspatientmobileno,"ssssss");
 
    let HOSTrimmedmobileno;
console.log(HOspatientmobileno.length,"rrrrrrrr")
 
    if(HOspatientmobileno.length > 10) {
      console.log("entering_mobile_no_if")
 
   HOSTrimmedmobileno = HOspatientmobileno.startsWith('91') ? HOspatientmobileno.slice(2):HOspatientmobileno;
    console.log(HOspatientmobileno,"HOS",HOSTrimmedmobileno);
  }
 
    else
   
    {
      console.log("entering_mobile_no_if")
 
      HOSTrimmedmobileno = HOspatientmobileno;
    }
   
    console.log(HOspatientmobileno,"aaaa");
 
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   
    dynamicConnection  = await createConnection(dynamicConnectionOptions);
 
 
   
 
    const patientInHos = await dynamicConnection.query('select patients.id from patients where patients.mobileno = ? or patients.mobileno = ?',[
      HOspatientmobileno,HOSTrimmedmobileno
    ])
   
let HOSpatientId;
 
 
if(patientInHos[0]){
  console.log("entering If");
 
  HOSpatientId = patientInHos[0].id
  console.log(HOSpatientId,"11221122");
 
 
}else{
  console.log("entering else");
 
  const datestring =  HOSpatient[0].dob;
  const dateObject = new Date(datestring);
  const Timestamp = dateObject.toISOString().replace('T',' ').replace(/\.\d+2$/,'');
 
  console.log(Timestamp,"ddddd");
 
  const createpatient = await dynamicConnection.query(`insert into patients  (
    patient_name,
    dob,
    image,
    mobileno,
    email,
    gender,
    address,
    ABHA_number
    )
    values(?,?,?,?,?,?,?,?)`,[
      HOSpatient[0].patient_name,
      HOSpatient[0].dob,
      HOSpatient[0].image,
      HOSpatient[0].mobile_no,
      HOSpatient[0].email,
      HOSpatient[0].gender,
      HOSpatient[0].address,
      HOSpatient[0].ABHA_number
    ])
    HOSpatientId = createpatient.insertId
    console.log(HOSpatientId,"==--==--");
 
 
}
const [staffEmailInHOS] = await this.connection.query(`select email from staff where id = ?`,[AppointmentEntity.doctor])
console.log("staffEmailAdmin",staffEmailInHOS.email);
 
const [adminStaff] = await dynamicConnection.query(`select id from staff where email = ?`,[staffEmailInHOS.email])
let adminStaffId = adminStaff.id
   
let payment_type;
if(AppointmentEntity.payment_mode = `cash`){
  payment_type = `Offline`
}
else{
  payment_type = `Online`
}
 
 
    var HOStransaction_id:number
    const HOScaseRef = await this.connection.query('INSERT INTO case_references values(default,default)')
    const HOSopdCreate = await this.connection.query(`
    insert into opd_details (case_reference_id,patient_id) values (?,?)`,[
      HOScaseRef.insertId,
      AppointmentEntity.patient_id
    ])
    const HOScharge = await this.connection.query('select charge_id from shift_details where shift_details.staff_id = ?',
    [AppointmentEntity.doctor])
    console.log(HOScharge,"..............");
   
    let HOScharge_id = HOScharge[0].charge_id
    // console.log(charge_id,"charge");
   
   
    const HOSamount = await this.connection.query(`  select charges.standard_charge,tax_category.percentage tax_percentage, round((charges.standard_charge+
      (charges.standard_charge*((tax_category.percentage)/100))),2) amount from
    charges join tax_category on charges.tax_category_id = tax_category.id
  where charges.id = ?
    `,[HOScharge_id])
   
  // console.log(amount,"amount");
   
  const Patient_charges_insert = await this.connection.query(
    `insert into patient_charges(
      date,
      opd_id,
      qty,
      charge_id,
      standard_charge,
     
      tax,
      apply_charge,
      amount
      ) values(?,?,?,?,?,?,?,?)`,[
        AppointmentEntity.date,
        HOSopdCreate.insertId,
        1,
        HOScharge_id,
        HOSamount[0].standard_charge,      
        HOSamount[0].tax_percentage,
        HOSamount[0].standard_charge,
        HOSamount[0].amount
   
      ]
  )
 
  const HOStransactions = await this.connection.query(`
  insert into transactions (
    type,
    section,
    patient_id,
    case_reference_id,
    amount,
    payment_mode,
    payment_date
    ) values
    (?,?,?,?,?,?,?)`,[
      'payment',
      'Appointment',
      AppointmentEntity.patient_id,
      HOScaseRef.insertId,
      HOSamount[0].amount,
      AppointmentEntity.payment_mode,
      AppointmentEntity.payment_date,
     
    ])
    HOStransaction_id = HOStransactions.insertId
    console.log(HOStransaction_id,"idddddddddddddd");
   
 
   
    const HOSvisitInsert = await this.connection.query(`
    insert into visit_details(
      opd_details_id,
      patient_charge_id,
      transaction_id,
      case_type,
      cons_doctor,
      appointment_date,
      live_consult,
      payment_mode
      ) values (?,?,?,?,?,?,?,?)`
      ,[
        HOSopdCreate.insertId,
     Patient_charges_insert.insertId,
        HOStransaction_id,
        "",
        AppointmentEntity.doctor,
        AppointmentEntity.date+" "+AppointmentEntity.time,
        AppointmentEntity.live_consult,
        AppointmentEntity.payment_mode
      ])
  const HOSvisit_details_id = HOSvisitInsert.insertId  
 
  const [adminGlobalShiftId] = await dynamicConnection.query(`select * from global_shift where Hospital_id = ? and
  hospital_global_shift_id = ?`,[
    AppointmentEntity.Hospital_id,
    AppointmentEntity.global_shift_id
  ])
  console.log(adminGlobalShiftId,"HosGlobalShiftId");
   
  console.log("dddd",  AppointmentEntity.shift_id,    AppointmentEntity.Hospital_id  );
 
  const [adminShiftId] = await dynamicConnection.query(`select * from doctor_shift where Hospital_id = ? and
  hospital_doctor_shift_id = ?`,[
    AppointmentEntity.Hospital_id,
    AppointmentEntity.shift_id
  ])
console.log("ssss",adminShiftId)
  let hos_appointment_id ;
  // console.log("11111",hos_appointment_id);
   
      const HOSbookAppnt = await this.connection.query(
        `insert into appointment(
          patient_id,
          case_reference_id,
          visit_details_id,
          date,
          time,
          doctor,
          source,
          global_shift_id,
          shift_id,
          live_consult,
          amount,
          message
         
          ) values(?,?,?,?,?,?,?,?,?,?,?,?)`,[
            AppointmentEntity.patient_id,
            HOScaseRef.insertId,
            HOSvisitInsert.insertId,
            AppointmentEntity.date,
            AppointmentEntity.time,
            AppointmentEntity.doctor,
            'Online',
            AppointmentEntity.global_shift_id,
            AppointmentEntity.shift_id,
            AppointmentEntity.live_consult,
            HOSamount[0].amount,
            AppointmentEntity.message
          ]
      )
 
       hos_appointment_id = HOSbookAppnt.insertId
 
       const Admin_Appt_Queue = await this.connection.query(`insert into appointment_queue(
        appointment_id,
        staff_id,
        shift_id,
        date
        ) values (?,?,?,?)`,[
          HOSbookAppnt.insertId,
          AppointmentEntity.doctor,
          AppointmentEntity.shift_id,
          AppointmentEntity.date
        ])
 
 
        const HosApptPayment = await this.connection.query(`insert into
        appointment_payment
        (appointment_id,
          charge_id,
          paid_amount,
          payment_mode,
          payment_type,
          transaction_id,
          date) values (?,?,?,?,?,?,?)`,[
            hos_appointment_id,
            HOScharge_id,
          HOSamount[0].amount,
          AppointmentEntity.payment_mode,
          payment_type,
          HOStransaction_id,
          AppointmentEntity.date+" "+AppointmentEntity.time
        ])
 
   
      if(HOStransaction_id){
  const HOSupdatetxn = await this.connection.query(`update transactions set transactions.appointment_id = ? where transactions.id = ?`,[
    HOSbookAppnt.insertId,
    HOStransaction_id
  ])      
      }
     
   
  // #############################################################################################################
   
  var transaction_id:number
  const caseRef = await dynamicConnection.query('INSERT INTO case_references values(default,default)')
  const opdCreate = await dynamicConnection.query(`
  insert into opd_details (case_reference_id,patient_id,Hospital_id,hos_opd_id) values (?,?,?,?)`,[
    caseRef.insertId,
    HOSpatientId,
    AppointmentEntity.Hospital_id,
    HOSopdCreate.insertId
  ])
   
   
  // console.log(amount,"amount");
 
  const getAdminChargeId = await dynamicConnection.query(`select id from charges
  where Hospital_id = ?
  and hospital_charges_id = ?`,[
    AppointmentEntity.Hospital_id,
    HOScharge_id
  ])
 
  const Patient_charges = await dynamicConnection.query(
    `insert into patient_charges(
      date,
      opd_id,
      qty,
      charge_id,
      standard_charge,
     
      tax,
      apply_charge,
      amount,Hospital_id,hos_patient_charges_id
      ) values(?,?,?,?,?,?,?,?,?,?)`,[
        AppointmentEntity.date,
        opdCreate.insertId,
        1,
        getAdminChargeId[0].id,
        HOSamount[0].standard_charge,      
        HOSamount[0].tax_percentage,
        HOSamount[0].standard_charge,
        HOSamount[0].amount,
        AppointmentEntity.Hospital_id,
        Patient_charges_insert.insertId
   
      ]
  )
  console.log("ssss",Patient_charges.insertId)
   try{
 
  const transactions = await dynamicConnection.query(`
  insert into transactions (
  type,
  section,
  patient_id,
  case_reference_id,
  amount,
  payment_mode,
  payment_date,Hospital_id,hos_transaction_id
  ) values
  (?,?,?,?,?,?,?,?,?)`,[
    'payment',
    'Appointment',
    HOSpatientId,
    caseRef.insertId,
    HOSamount[0].amount,
    AppointmentEntity.payment_mode,
    AppointmentEntity.payment_date,
    AppointmentEntity.Hospital_id,
    HOStransaction_id
  ])
  transaction_id = transactions.insertId
  console.log(transaction_id,"idddddddddddddd");
   
  } catch (error) {
    return "error in admin transaction insert"
  }
   
  const visitInsert = await dynamicConnection.query(`
  insert into visit_details(
    opd_details_id,
    patient_charge_id,
    transaction_id,
    case_type,
    cons_doctor,
    appointment_date,
    live_consult,
    payment_mode,Hospital_id,hos_visit_id
    ) values (?,?,?,?,?,?,?,?,?,?)`
    ,[
      opdCreate.insertId,
      Patient_charges.insertId,
      transaction_id,
      "",
      adminStaffId,
      AppointmentEntity.date+" "+AppointmentEntity.time,
      AppointmentEntity.live_consult,
      AppointmentEntity.payment_mode,
      AppointmentEntity.Hospital_id,
      HOSvisitInsert.insertId
    ])
  const visit_details_id = visitInsert.insertId    
//
  console.log(hos_appointment_id,"wwwwww");
   
    const bookAppnt = await dynamicConnection.query(
      `insert into appointment(
        patient_id,
        case_reference_id,
        visit_details_id,
        date,
        time,
        doctor,
        source,
        global_shift_id,
        shift_id,
        live_consult,
        Hospital_id,hos_appointment_id,
        amount,
        message
        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[
          HOSpatientId,
          caseRef.insertId,
          visitInsert.insertId,
          AppointmentEntity.date,
          AppointmentEntity.time,
          adminStaffId,
          'Online',
          adminGlobalShiftId.id,
          adminShiftId.id,
          AppointmentEntity.live_consult,
          AppointmentEntity.Hospital_id,
          hos_appointment_id,
          HOSamount[0].amount,
          AppointmentEntity.message
        ]
    )
 
    const Appt_Queue = await dynamicConnection.query(`insert into appointment_queue(
      appointment_id,
      staff_id,
      shift_id,
      date
      ) values (?,?,?,?)`,[
        bookAppnt.insertId,
        adminStaffId,
        adminShiftId.id,
        AppointmentEntity.date
      ])
 
      const AdminApptPayment = await dynamicConnection.query(`insert into
    appointment_payment
    (appointment_id,
      charge_id,
      paid_amount,
      payment_mode,
      payment_type,
      transaction_id,
      date) values (?,?,?,?,?,?,?)`,[
      bookAppnt.insertId,
      getAdminChargeId[0].id,
      HOSamount[0].amount,
      AppointmentEntity.payment_mode,
      payment_type,
      transaction_id,
      AppointmentEntity.date+" "+AppointmentEntity.time
    ])
 
   
   console.log(hos_appointment_id,"dddddd")
    if(transaction_id){
  const updatetxn = await dynamicConnection.query(`update transactions set transactions.appointment_id = ? where transactions.id = ?`,[
  bookAppnt.insertId,
  transaction_id
  ])      
    }
      await dynamicConnection.close();
 
   
    console.log("eeeeeeee")
 
    return [{
      "status":"success",
      "messege":"Appointment booked successfully",
      "inserted_details":await this.connection.query(
        `select appointment.id, patients.patient_name,concat('APPN','',appointment.id) as appointment_no, appointment.date,appointment.time,patients.mobileno,patients.gender,patients.email,
        CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,appointment.source,appoint_priority.priority_status,appoint_priority.id priorityID,appointment.live_consult,
        appointment.appointment_status,appointment.amount,global_shift.id  as shift_id,global_shift.name as shift,doctor_shift.id as slot_id,
        doctor_shift.day as slot, appointment.created_at from appointment
        join patients ON appointment.patient_id = patients.id
        left join staff ON appointment.doctor = staff.id
        left join appoint_priority ON appointment.priority = appoint_priority.id
        left join transactions ON appointment.amount = transactions.id
        left join global_shift ON appointment.global_shift_id = global_shift.id
        left join doctor_shift ON appointment.shift_id = doctor_shift.id where appointment.id = ?`
        ,[HOSbookAppnt.insertId])
    }];
   
    } catch (error) {
      if(dynamicConnection){
        await dynamicConnection.close();
        return error
      }
    }
  }
 
 
 
async findAll(): Promise<AddAppointment[]> {
 
  const appointment = await this.connection.query(`select appointment.id, patients.patient_name,concat('APPN','',appointment.id) as appointment_no, appointment.date,patients.mobileno,patients.gender,
  CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,appointment.source,appoint_priority.priority_status,appointment.time,appoint_priority.id priorityID,appointment.live_consult,
  appointment.appointment_status,appointment.amount,global_shift.id  as shift_id,global_shift.name as shift,doctor_shift.id as slot_id,
  doctor_shift.day as slot from appointment
  join patients ON appointment.patient_id = patients.id
  left join staff ON appointment.doctor = staff.id
  left join appoint_priority ON appointment.priority = appoint_priority.id
  left join transactions ON appointment.amount = transactions.id
  left join global_shift ON appointment.global_shift_id = global_shift.id
  left join doctor_shift ON appointment.shift_id = doctor_shift.id`);
  return appointment ;
}
 
async findOne(id: string): Promise<AddAppointment | null> {
  const appointment = await this.connection.query(`select appointment.id, patients.patient_name,concat('APPN','',appointment.id) as appointment_no, appointment.date,patients.mobileno,patients.gender,
  CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,appointment.source,appoint_priority.priority_status,appointment.live_consult,
  appointment.appointment_status,appointment.amount,global_shift.id  as shift_id,global_shift.name as shift,doctor_shift.id as slot_id,
  doctor_shift.day as slot from appointment
  join patients ON appointment.patient_id = patients.id
  left join staff ON appointment.doctor = staff.id
  left join appoint_priority ON appointment.priority = appoint_priority.id
  left join transactions ON appointment.amount = transactions.id
  left join global_shift ON appointment.global_shift_id = global_shift.id
  left join doctor_shift ON appointment.shift_id = doctor_shift.id WHERE appointment.id = ?`, [id]);
 
  if (appointment.length === 1) {
    return appointment
  } else {
    return null;
  }
}
 
 
 
async update(id:number,AppointmentEntity: AddAppointment){
  let dynamicConnection;
 
  try{
 
  //  const hoscredentials = await this.connection.query(`select ip,db_name,db_password,username
  //  from hospital_credentials where hospital_id = ?`,[AppointmentEntity.Hospital_id])
 
 
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
 
  dynamicConnection = await createConnection(dynamicConnectionOptions);
  const [getAppntDetails] = await dynamicConnection.query(`select id,visit_details_id from appointment  where Hospital_id = ? and hos_appointment_id = ?`,[AppointmentEntity.Hospital_id,id])
  console.log(getAppntDetails,"=====");
 
const adminApptId = getAppntDetails.id
  console.log("hosAppt_id",adminApptId);
 
  const AdminVisitDetailsId = getAppntDetails.visit_details_id
  console.log("AdminVisitDetailsId",AdminVisitDetailsId);
 
  console.log("eeeee")
  const [getVisitDetailsId] = await this.connection.query(`select visit_details_id from appointment where id = ?`,[id])
  console.log("getVisitDetailsId",getVisitDetailsId.visit_details_id);
    const hosVisitDetailsId = getVisitDetailsId.visit_details_id
    console.log("hosVisitDetailsId",hosVisitDetailsId);
   
   const hosVisitUpdate = await this.connection.query(`update visit_details set
   appointment_date = ?,
   live_consult = ?
   where id = ?`,[
    AppointmentEntity.date+" "+AppointmentEntity.time,
    AppointmentEntity.live_consult,
    hosVisitDetailsId
   ])
 
   console.log("rrrreeeerrrreeeeyeyeiruey");
   
 
const hosApptUpdate = await this.connection.query(`update appointment set
date = ?,
time = ?,
global_shift_id = ?,
shift_id = ?,
live_consult = ?,
priority = ?,
appointment_status = ?,
message = ? where id = ?`,[
AppointmentEntity.date,
AppointmentEntity.time,
AppointmentEntity.global_shift_id,
AppointmentEntity.shift_id,
AppointmentEntity.live_consult,
AppointmentEntity.priority,
AppointmentEntity.appointment_status,
AppointmentEntity.message,
id
]
)
 
  const adminVisitDetailsUpdate = await dynamicConnection.query(`update visit_details set
  appointment_date = ?,
  live_consult = ?
  where id = ?`,[
   AppointmentEntity.date+" "+AppointmentEntity.time,
   AppointmentEntity.live_consult,
   AdminVisitDetailsId
  ])
 
  const [adminGlobalShiftId] = await dynamicConnection.query(`select id from global_shift where Hospital_id = ? and
  hospital_global_shift_id = ?`,[
    AppointmentEntity.Hospital_id,
    AppointmentEntity.global_shift_id
  ])
  console.log(adminGlobalShiftId,"HosGlobalShiftId");
   
  const [adminShiftId] = await dynamicConnection.query(`select id from doctor_shift where Hospital_id = ? and
  hospital_doctor_shift_id = ?`,[
    AppointmentEntity.Hospital_id,
    AppointmentEntity.shift_id
  ])
 
console.log(adminGlobalShiftId,adminShiftId,"11221122");
 
  try {
    const adminApptUpdate = await dynamicConnection.query(`update appointment set
date = ?,
time = ?,
global_shift_id = ?,
shift_id = ?,
live_consult = ?,
appointment_status = ?,
priority = ?,
message = ?
where id = ?`,[
  AppointmentEntity.date,
  AppointmentEntity.time,
  adminGlobalShiftId.id,
  adminShiftId.id,
  AppointmentEntity.live_consult,
  AppointmentEntity.appointment_status,
  AppointmentEntity.priority,
  AppointmentEntity.message,
  adminApptId
]
)
console.log("ssssss");
  } catch (error) {
    console.log(error);
   
  }
 
 
await dynamicConnection.close();
 
  return  [{
    "status":"success",
    "messege":"Appointment updated successfully",
    "updated_details":await this.connection.query('select * from appointment where id = ?',[id])
  }];
 
} catch (error) {
  if (dynamicConnection) {
    await dynamicConnection.close();
  }
  return "error is : "+error
}
}
 
 
 
 
 
 
 
async remove(id: string,hos_id:number): Promise<{ [key: string]: any }[]> {
  let dynamicConnection;
  try {
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
 
    dynamicConnection = await createConnection(dynamicConnectionOptions);
 
     const delAdminAppt = await dynamicConnection.query(`update appointment set is_deleted = 1 where Hospital_id = ?
      and hos_appointment_id = ?`,[hos_id,id])
    const result = await this.connection.query('DELETE FROM appointment WHERE id = ?', [id]);
    if (dynamicConnection) {
      await dynamicConnection.close();  
    }
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  } catch (error) {
    if (dynamicConnection) {
      await dynamicConnection.close();
    }
    return error
  }
 
 
}
 
}