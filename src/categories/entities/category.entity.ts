import { Admin } from 'src/admin/entities/admin.entity';
import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @ManyToOne(() => Admin, (admin) => admin.categories)
  admin: Admin;
  @OneToMany(() => MenuPosition, (position) => position.category, {
    onDelete: 'SET NULL',
  })
  positions: MenuPosition[];
}
