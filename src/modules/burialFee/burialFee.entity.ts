import { BaseAddressEntity } from "src/commons/bases/baseAddressEntity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "../year/year.entity";
import { Profile } from "../profile/profile.entity";

@Entity("burialFee")
export class burialFee extends BaseAddressEntity {
  constructor(doet: Partial<burialFee>) {
    super(doet);
    const keys = [
      "id",
      "decided",
      "decidedDate",
      "decidedPerson",
      "fee",
      "startDate",
      "stopDate",
      "type",
      "yearId",
      "profilesId",
      "doet_id",
      "infoBeneficiary",
      "unitId",
    ];
    doet &&
    keys.forEach((key) => {
      doet[key] !== undefined && (this[key] = doet[key]);
    });
  }

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  decided: string;

  @Column({ nullable: true })
  decidedDate: Date;

  @Column({ nullable: true })
  decidedPerson: string;

  @Column({ nullable: true })
  fee: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  stopDate: Date;

  @Column({ nullable: true })
  type: number;

  @Column({ nullable: true })
  doet_id: number;

  @OneToOne(
    () => Year,
    (year: Year) => year.id
  )
  @Column({ nullable: true })
  yearId: number;

  @ManyToOne(
    () => Profile,
      profile => profile.burialFee,
    { cascade: ['insert', 'update'] }
  )
  profiles: Profile;
  @Column({ nullable: true })
  profilesId: number;

  @Column({ nullable: true })
  unitId: number;
}
