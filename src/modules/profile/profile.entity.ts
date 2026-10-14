import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { File } from '../file/file.entity';
import { Info } from '../info/info.entity';
import { InfoBeneficiary } from '../infoBeneficiary/infoBeneficiary.entity';
import { InfoAddress } from '../infoAddress/infoAddress.entity';
import { InfoNcc } from '../infoNcc/infoNcc.entity';
import {
  Gender,
  Other,
  Point,
  Transfer,
} from './profile.model';
import { Preferential } from '../preferential/preferential.entity';
import { burialFee } from "../burialFee/burialFee.entity";
import { KeyValue } from "../../commons/bases/baseAddressEntity";
import { ListProfiles } from "../list/list.entity";

@Entity('profiles')
export class Profile extends BaseEntity {
  constructor(profile: Partial<Profile>) {
    super(profile);
    const keys = [
      'id',
      'code',
      'fullName',
      'dateOfBirth',
      'gender',
      'nativePlace',
      'address',
      'ward',
      'district',
      'province',
      'info',
      'infoNcc',
      'infoAddress',
      'attachment',
      'infoBeneficiary',
      'files',
      'point',
      'other',
      'paid',
      'payDate',
      'excute',
      'move',
      'bhyt',
      'categoryId',
      'doet_id',
      'education',
      'unitId',
      'workUnit',
      'prefers',
      'listProfiles',
    ];
    profile &&
      keys.forEach((key) => {
        profile[key] !== undefined && (this[key] = profile[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  bhyt: Date;

  @Column({ nullable: true })
  gender: Gender;

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

  @Column({ type: 'jsonb', nullable: true })
  other: Other;

  @Column({ type: 'jsonb', nullable: true })
  attachment: any;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  point: Point;

  @Column({ nullable: true, type: 'jsonb' })
  prefers: Preferential[];

  @Column({ type: 'jsonb', nullable: true })
  move: Transfer[];

  @OneToMany(() => InfoNcc, (info: InfoNcc) => info.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  infoNcc: InfoNcc[];

  @OneToMany(() => Info, (info: Info) => info.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  info: Info[];

  @OneToMany(() => File, (file: File) => file.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  files: File[];

  @OneToMany(
    () => InfoBeneficiary,
    (infoBeneficiary: InfoBeneficiary) => infoBeneficiary.profile,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  infoBeneficiary: InfoBeneficiary[];

  @OneToMany(
    () => InfoAddress,
    (infoAddress: InfoAddress) => infoAddress.profile,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  infoAddress: InfoAddress[];

  @Column({ nullable: true })
  doet_id: number;

  @Column({ nullable: true, type: 'jsonb' })
  education: any ;

  @Column({ nullable: true })
  unitId: number;

  @OneToMany(() => burialFee, burialFee => burialFee.profiles)
  burialFee: burialFee[];

  @OneToMany(type => ListProfiles, listProfiles => listProfiles.profiles)
  listProfiles: ListProfiles[];
}

@Entity('profiles_prefers')
export class ProfilePrefers {
  constructor(profilePrefers: Partial<ProfilePrefers>) {
    const keys = [
      'id',
      'profile_id',
      'prefer_id',
      'day',
      'month',
      'paid'
    ];
    profilePrefers &&
    keys.forEach((key) => {
      profilePrefers[key] !== undefined && (this[key] = profilePrefers[key]);
    });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  profile_id: number;

  @Column({ nullable: false })
  day: number;

  @Column({ nullable: false })
  month: number;

  @Column({ nullable: false })
  paid: number;
}