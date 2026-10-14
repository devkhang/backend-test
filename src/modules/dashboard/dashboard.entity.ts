import { BaseAddressEntity } from 'src/commons/bases/baseAddressEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dashboard')
export class DashboardEntity extends BaseAddressEntity {
  constructor(doet: Partial<DashboardEntity>) {
    super(doet);
    const keys = ['id', 'name', 'parentId', 'domain'];
    doet &&
      keys.forEach((key) => {
        doet[key] !== undefined && (this[key] = doet[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  parentId: number;
}
