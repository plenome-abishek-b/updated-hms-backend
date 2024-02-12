    import { Timestamp } from "typeorm";

export class AddAppointment {
    id:number;
    patient_id:number;
    case_reference_id:number;
    visit_details_id:number;
    date:string;
    time:string;
    priority:number;
    specialist:number;
    doctor:number;
    message:string;
    amount:string;
    appointment_status:string;
    source:string;
    is_opd:string;
    payment_mode:string;
    payment_date:string;
    is_ipd:string;
    global_shift_id:number;
    shift_id:number;
    is_queue:number;
    live_consult:string;
    created_at:Timestamp;
    Hospital_id:number;
    hos_appointment_id:number;
}
