
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IncomeSummary {
  @PrimaryGeneratedColumn()
  id: number;

}
