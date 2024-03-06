import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatientbillReport {
  @PrimaryGeneratedColumn()
  id: number;
}
