import { BaseEntity } from 'src/commons';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  constructor(
    category?: Partial<Category>,
    keys: string[] = [
      'id',
      'name',
      'status',
      'yearId',
      'parentId',
      'key',
      'unitId',
      'index',
      'doet_id'
    ],
  ) {
    super(category);
    category &&
      keys.forEach((key) => {
        category[key] !== undefined && (this[key] = category[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ nullable: true, type: 'int' })
  parentId: number;

  @Column({ nullable: true, type: 'int' })
  yearId: number;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  unitId: number;

  @Column({ nullable: true })
  index: number;

  @Column({ nullable: true })
  doet_id: number;
}
