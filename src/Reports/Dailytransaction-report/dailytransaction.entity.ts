import {
    Entity,
    PrimaryGeneratedColumn,
   
  } from 'typeorm';


  @Entity({ name: 'transactions' })
  export class Transaction {

    @PrimaryGeneratedColumn()
    id: number;
    type: string;
    section: string;
    patient_id: number;
    case_reference_id: number;
    opd_id: number;
    ipd_id: number;
    pharmacy_bill_basic_id: number;
    pathology_billing_id: number;
    radiology_billing_id: number;
    blood_donor_cycle_id: number;
    blood_issue_id: number;
    ambulance_call_id: number;
    appointment_id: number;
    attachment: string;
    attachment_name: string;
    amount_type: string;
    amount: number;
    payment_mode: string;
    cheque_no: string;
    cheque_date: Date;
    payment_date: Date;
    note: string;
    received_by: number;
    createdAt: Date;
    updatedAt: Date;
   
  }
  