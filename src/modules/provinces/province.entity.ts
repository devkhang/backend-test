import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { District } from './district.entity';

@Entity('provinces')
export class Province extends BaseEntity {
  constructor(province: Partial<Province>) {
    super(province);
    this.type = province?.type;
    this.cities = province?.cities;
  }
  @Column({ nullable: false })
  type: string;

  @OneToMany(() => District, (district) => district.province, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  cities: District[];
}
