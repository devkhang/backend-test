import { BaseAddressEntity, KeyValue } from "src/commons/bases/baseAddressEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { type } from "./form.module";

@Entity("form")
export class Form extends BaseAddressEntity {
  constructor(form: Partial<Form>) {
    super(form);
    const keys = [
      "id",
      "no",
      "type",
      "name",
      "content",
      "publishDate",
      "status",
      "file",
      "doet_id",
      "yearId",
    ];
    form &&
    keys.forEach((key) => {
      form[key] !== undefined && (this[key] = form[key]);
    });
  }

  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false })
  no: string;

  @Column({ nullable: true })
  type: type;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  publishDate: Date;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  file: KeyValue[];

  @Column({ nullable: true })
  doet_id: number;

  @Column({ nullable: true })
  yearId: number;
}
