import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  @Entity({ name: 'ipd_details' })
  export class IpdDetailsEntity {
    @PrimaryGeneratedColumn()
    id: number;
    date: Date;
    symptoms: string;
    patient_id: number;
    cons_doctor: number;
    case_reference_id: number;
    bed_group_id: number;
    
    }