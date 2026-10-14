import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { District } from './district.entity';

@Entity('wards')
export class Ward extends BaseEntity {
  constructor(ward: Partial<Ward>) {
    super(ward);
    this.type = ward?.type;
  }

  @Column({ nullable: false })
  type: string;

  @Exclude()
  @ManyToOne(() => District, (district) => district.districts)
  district: District;
}
