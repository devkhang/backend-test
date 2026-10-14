import { BaseEntity } from "src/commons";
import { KeyValue } from "src/commons/bases/baseAddressEntity";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../file/file.model";
import { Profile } from "../profile/profile.entity";
import { Gender } from "../profile/profile.model";

@Entity("infoBeneficiaries")
export class InfoBeneficiary extends BaseEntity {
  constructor(benef: Partial<InfoBeneficiary>) {
    super(benef);
    const keys = [
      "id",
      "profile",
      "files",
      "fullName",
      "dateOfBirth",
      "gender",
      "nativePlace",
      "address",
      "ward",
      "district",
      "province",
      "identityCard",
      "date",
      "place",
      "relation",
      "beneficiary",
      "relative",
      "isNcc",
      "dateOfNccDeath",
      "status",
      "note",
      "present",
      "beneficiaryObj"
    ];
    benef &&
    keys.forEach((key) => {
      benef[key] !== undefined && (this[key] = benef[key]);
    });
  }

  @PrimaryGeneratedColumn("increment")
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

  @Column({ nullable: true, type: "jsonb" })
  place: KeyValue;

  @Column({ nullable: true })
  nativePlace: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: "jsonb", nullable: true })
  ward: KeyValue;

  @Column({ type: "jsonb", nullable: true })
  district: KeyValue;

  @Column({ type: "jsonb", nullable: true })
  province: KeyValue;

  @Column({ nullable: true })
  dateOfNccDeath: Date;

  @Column({ nullable: true })
  relation: string;

  @Column({ nullable: true, type: "jsonb" })
  files: Files[];

  @Column({ nullable: true })
  beneficiary: boolean;

  @Column({ nullable: true })
  relative: boolean;

  @Column({ nullable: true })
  isNcc: boolean;

  @Column({ nullable: true, default: true })
  status: boolean;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  present: string;

  @Column({ nullable: true })
  beneficiaryObj: string;

  @ManyToOne(() => Profile, (profile: Profile) => profile.infoBeneficiary)
  @JoinColumn({ name: "profileId" })
  profile: Profile;
}
