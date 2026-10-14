import { BaseEntity } from 'src/commons';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Gender } from '../profile/profile.model';
import { disabilitiesChildren, Htc } from './infoNcc.model';

@Entity('infoNccs')
export class InfoNcc extends BaseEntity {
  constructor(infoNcc: Partial<InfoNcc>) {
    super(infoNcc);
    const keys = [
      'id',
      'fullName',
      'profile',
      'dateOfBirth',
      'gender',
      'identityCard',
      'date',
      'place',
      'dead',
      'htc',
      'disabilitiesChildren',
      'note',
      'enlistmentDate',
      'level',
      'sacrificialUnit',
      'sacrificialCase',
      'enlistmentUnit',
      'demobilizationTime',
      'demobilizationUnit',
      'demobilizationRank',
      'CATime1',
      'CTTime1',
      'KKTime1',
      'CATime2',
      'CTTime2',
      'KKTime2',
      'unit',
      'rank',
      'injuredPlace',
      'type',
      'injuredCase',
      'injuredCondition',
      'proof',
      'disabilityCondition',
      'sacrificialPlace',
      'ethnic',
      'bhytSupport',
    ];
    infoNcc &&
      keys.forEach((key) => {
        infoNcc[key] !== undefined && (this[key] = infoNcc[key]);
      });
  }
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  identityCard: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true, type: 'jsonb' })
  place: KeyValue;

  @Column({ nullable: true })
  dead: string;

  @Column({ nullable: true, type: 'jsonb' })
  htc: Htc;

  @Column({ nullable: true, type: 'jsonb' })
  disabilitiesChildren: disabilitiesChildren[];

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Profile, (profile: Profile) => profile.infoNcc)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ nullable: true })
  enlistmentDate: Date;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  sacrificialUnit: string;

  @Column({ nullable: true })
  sacrificialCase: string;

  @Column({ nullable: true })
  enlistmentUnit: string;

  @Column({ nullable: true })
  demobilizationTime: string;

  @Column({ nullable: true })
  demobilizationUnit: string;

  @Column({ nullable: true })
  demobilizationRank: string;

  @Column({ nullable: true })
  CATime1: number;

  @Column({ nullable: true })
  CTTime1: number;

  @Column({ nullable: true })
  KKTime1: number;

  @Column({ nullable: true })
  CATime2: number;

  @Column({ nullable: true })
  CTTime2: number;

  @Column({ nullable: true })
  KKTime2: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  injuredPlace: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  injuredCase: string;

  @Column({ nullable: true })
  injuredCondition: string;

  @Column({ nullable: true })
  proof: string;

  @Column({ nullable: true })
  disabilityCondition: string;

  @Column({ nullable: true })
  sacrificialPlace: string;

  @Column({ type: 'jsonb', nullable: true })
  ethnic: KeyValue;

  @Column({ type: 'jsonb', nullable: true })
  bhytSupport: boolean;
}
