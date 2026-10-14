import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Files } from './file.model';

@Entity('files')
export class File extends BaseEntity {
  constructor(file: Partial<File>) {
    super(file);
    const keys = [
      'id',
      'LT3',
      'TKN3',
      'TQGCfile',
      'decidedFile',
      'deathFile',
      'injuredFile',
      'assessmentFile',
      'revolutionFile',
      'rewardFile',
      'other',
      'profile',
    ];
    file &&
      keys.forEach((key) => {
        file[key] !== undefined && (this[key] = file[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, type: 'jsonb' })
  LT3: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  TKN3: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  TQGCfile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  decidedFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  deathFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  injuredFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  assessmentFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  revolutionFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  rewardFile: Files[];

  @Column({ nullable: true, type: 'jsonb' })
  other: Files[];

  @ManyToOne(() => Profile, (profile: Profile) => profile.files)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
