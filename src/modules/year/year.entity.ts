import { BaseEntity } from 'src/commons';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('years')
export class Year extends BaseEntity {
  constructor(year: Partial<Year>) {
    super(year);
    const keys = [
      'id',
      'year',
      'unitPrice',
      'categories',
      'unitId',
      'status'
    ];
    year &&
      keys.forEach((key) => {
        year[key] !== undefined && (this[key] = year[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  year: string;

  @Column({ nullable: true })
  unitPrice: string;

  @Column({ nullable: true, type: 'jsonb' })
  categories: Category[];

  @Column({ nullable: true })
  unitId: number;

  @Column({ nullable: true, default: true })
  status: boolean;
}
