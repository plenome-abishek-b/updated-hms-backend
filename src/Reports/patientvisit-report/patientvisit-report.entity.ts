import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PatientvisitReport {
  @PrimaryGeneratedColumn()
  id: number;
}
