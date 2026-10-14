import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

@Entity('districts')
export class District extends BaseEntity {
  constructor(district: Partial<District>) {
    super(district);
    this.type = district?.type;
    this.districts = district?.districts;
  }
  @Column({ nullable: false })
  type: string;

  @OneToMany(() => Ward, (ward) => ward.district, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  districts: Ward[];

  @Exclude()
  @ManyToOne(() => Province, (province) => province.cities)
  province: Province;
}
