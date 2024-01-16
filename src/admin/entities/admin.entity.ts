import { IsEmail } from 'class-validator';
import { Barista } from 'src/barista/entities/barista.entity';
import { Point } from 'src/points/entities/points.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column()
  @IsEmail()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Barista, (barista) => barista.admin, {
    onDelete: 'SET NULL',
  })
  baristas: Barista[];
  @OneToMany(() => Point, (point) => point.admin, {
    onDelete: 'SET NULL',
  })
  points: Point[];
}
