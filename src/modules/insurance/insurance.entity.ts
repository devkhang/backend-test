import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "../year/year.entity";

@Entity("insurance")
export class InsuranceEntity {
  constructor(insurance: Partial<InsuranceEntity>) {
    const keys = [
      "id",
      "yearId",
      "fee",
      "doet_id"
    ];
    insurance &&
    keys.forEach((key) => {
      insurance[key] !== undefined && (this[key] = insurance[key]);
    });
  }

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  fee: number;

  @OneToOne(
    () => Year,
    (year: Year) => year.id
  )
  @Column({ nullable: true })
  yearId: number;

  @Column({ nullable: true })
  doet_id: number;
}
