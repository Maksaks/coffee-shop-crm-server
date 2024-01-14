import { Barista } from 'src/barista/entities/barista.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ShiftStatus {
  StartOfWork = 'Start of work',
  EndOfWork = 'End of work',
}

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.StartOfWork })
  status: ShiftStatus;
  @CreateDateColumn()
  time: Date;
  @ManyToOne(() => Barista, (barista) => barista.shifts)
  @JoinColumn({ name: 'barista_id' })
  barista: Barista;
}
