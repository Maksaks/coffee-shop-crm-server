import { MenuPosition } from 'src/menu-position/entities/menu-position.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @OneToMany(() => MenuPosition, (position) => position.category, {
    onDelete: 'SET NULL',
  })
  positions: MenuPosition[];
}
