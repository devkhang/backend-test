import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ethnic')
export class EthnicEntity {
  constructor(ethnic: Partial<EthnicEntity>) {
    const keys = ['id', 'name'];
    ethnic &&
      keys.forEach((key) => {
        ethnic[key] !== undefined && (this[key] = ethnic[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;
}
