import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { inprogressJailed, inprogressRevolution, Reward } from './info.model';

@Entity('infos')
export class Info extends BaseEntity {
  constructor(info: Partial<Info>) {
    super(info);
    const keys = [
      'id',
      'code',
      'profile',
      'profileId',
      'dateJoinClan',
      'date',
      'position',
      'organ',
      'rank',
      'retire',
      'startDateRevolution',
      'endDateRevolution',
      'roleRevolution',
      'takeOfficeDate',
      'inprogressRevolution',
      'inprogressJailed',
      'degree',
      'decided',
      'decidedDate',
      'organManager',
      'injured',
      'verifyDate',
      'injuredDate',
      'reward',
      'note',
      'deathCertificateNum',
      'deathCertificateDate',
      'burialGrave',
      'medicalAssessmentNum',
      'medicalAssessmentDate',
      'medicalCondition',
      'inspectionNum',
      'inspectionDate',
      'inspectionBoard',
      'certificationNum',
      'certificationDate',
      'decisionKind',
      'of',
      'object',
      'ofCDHH',
    ];
    info &&
      keys.forEach((key) => {
        info[key] !== undefined && (this[key] = info[key]);
      });
  }
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  code: string;

  @Column({ nullable: true })
  dateJoinClan: Date;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  organ: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  retire: Date;

  @Column({ nullable: true })
  startDateRevolution: Date;

  @Column({ nullable: true })
  endDateRevolution: Date;

  @Column({ nullable: true })
  roleRevolution: string;

  @Column({ nullable: true })
  takeOfficeDate: string;

  @Column({ nullable: true, type: 'jsonb' })
  inprogressRevolution: inprogressRevolution[];

  @Column({ nullable: true, type: 'jsonb' })
  inprogressJailed: inprogressJailed[];

  @Column({ nullable: true })
  degree: string;

  @Column({ nullable: true })
  decided: string;

  @Column({ nullable: true })
  decidedDate: Date;

  @Column({ nullable: true })
  organManager: string;

  @Column({ nullable: true })
  injured: string;

  @Column({ nullable: true })
  verifyDate: Date;

  @Column({ nullable: true })
  injuredDate: Date;

  @Column({ nullable: true })
  reward: Reward;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Profile, (profile: Profile) => profile.info)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ nullable: true })
  deathCertificateNum: string;

  @Column({ nullable: true })
  deathCertificateDate: string;

  @Column({ nullable: true })
  burialGrave: string;

  @Column({ nullable: true })
  medicalAssessmentNum: string;

  @Column({ nullable: true })
  medicalAssessmentDate: string;

  @Column({ nullable: true })
  medicalCondition: string;

  @Column({ nullable: true })
  inspectionNum: string;

  @Column({ nullable: true })
  inspectionDate: string;

  @Column({ nullable: true })
  inspectionBoard: string;

  @Column({ nullable: true })
  certificationNum: string;

  @Column({ nullable: true })
  certificationDate: string;

  @Column({ nullable: true })
  decisionKind: string;

  @Column({ nullable: true })
  of: string;

  @Column({ nullable: true })
  object: string;

  @Column({ nullable: true })
  ofCDHH: string;
}
