import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { KeyValue } from "../../commons/bases/baseAddressEntity";

@Entity('infoAddress')
export class InfoAddress extends BaseEntity {
  constructor(infoAddress: Partial<InfoAddress>) {
    super(infoAddress);
    const keys = [
      'id',
      'nativePlace',
      'address',
      'ward',
      'district',
      'province',
      'profile'
    ];
    infoAddress &&
      keys.forEach((key) => {
        infoAddress[key] !== undefined && (this[key] = infoAddress[key]);
      });
  }
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  nativePlace: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  ward: KeyValue;

  @Column({ type: 'jsonb', nullable: true })
  district: KeyValue;

  @Column({ type: 'jsonb', nullable: true })
  province: KeyValue;

  @ManyToOne(() => Profile, (profile: Profile) => profile.infoAddress)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
