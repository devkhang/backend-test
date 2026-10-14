import { BaseAddressEntity } from 'src/commons/bases/baseAddressEntity';
import {
  Column,
  Entity, JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  PrimaryColumn, OneToMany, ManyToOne
} from "typeorm";
import { SubsidyForm } from '../preferential/preferential.entity';
import { ExcuteUnit, Status, Type } from './list.model';
import { Profile } from "../profile/profile.entity";

@Entity('lists')
export class List extends BaseAddressEntity {
  constructor(list: Partial<List>) {
    super(list);
    const keys = [
      'id',
      'code',
      'foundedDate',
      'receiveDate',
      'unit',
      'total', // total money
      'point',
      'form', // month, year
      'type', // paid, execute
      'yearId',
      'note',
      'categoryId',
      'provinceId',
      'districtId',
      'wardId',
      'executeNote',
      'doet_id',
      'unitId',
      'profile',
    ];
    list &&
    keys.forEach((key) => {
      list[key] !== undefined && (this[key] = list[key]);
    });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ nullable: true })
  foundedDate: Date;

  @Column({ nullable: true })
  receiveDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  unit: ExcuteUnit;

  @Column({ nullable: true })
  total: string;

  @Column({ nullable: true })
  point: Status;

  @Column({ nullable: true })
  form: SubsidyForm;

  @Column({ nullable: true })
  type: Type;

  @Column({ nullable: true })
  yearId: number;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  executeNote: string;

  @Column({ nullable: true })
  provinceId: number;

  @Column({ nullable: true })
  districtId: number;

  @Column({ nullable: true })
  wardId: number;

  @OneToMany(type => ListProfiles, listProfiles => listProfiles.lists)
  listProfiles: ListProfiles[];

  @Column({ nullable: true })
  doet_id: number;

  @Column({ nullable: true })
  unitId: number;

  @Column({ type: 'jsonb', nullable: true })
  profile: any;
}

@Entity('lists_profiles')
export class ListProfiles  {
  constructor(listProfile: Partial<ListProfiles>) {
    const keys = [
      'listsId',
      'profilesId',
      'prefers',
    ];
    listProfile &&
    keys.forEach((key) => {
      listProfile[key] !== undefined && (this[key] = listProfile[key]);
    });
  }

  @Column({ type: 'jsonb', nullable: true })
  prefers: number[];

  @ManyToOne(type => List, list => list.id, {
    primary: true
  })
  lists: List;

  @ManyToOne(type => Profile, profile => profile.id, {
    primary: true
  })
  profiles: Profile;
}
