import { BaseEntity } from 'src/commons';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ListPaid } from '../profile/profile.model';

export enum SubsidyForm {
  Once,
  Month,
  Year,
  Other,
}

export enum Benef {
  Ncc,
  Relative,
  Under18,
  worshiper,
  carer,
  aduAllowance
}

@Entity('preferentials')
export class Preferential extends BaseEntity {
  constructor(
    prefer?: Partial<Preferential>,
    keys: string[] = [
      'id',
      'name',
      'code',
      'status',
      'parentId',
      'price',
      'subsidyForm',
      'subsidy',
      'allowance',
      'yearId',
      'categoryId',
      'display',
      'other',
      'beneficiary',
      'provinceId'
    ],
  ) {
    super(prefer);
    prefer &&
      keys.forEach((key) => {
        prefer[key] !== undefined && (this[key] = prefer[key]);
      });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  price: string;

  // 0: Một lần
  // 1: Tháng
  // 2: Năm
  // 3: Bổ sung
  @Column({ nullable: true })
  subsidyForm: SubsidyForm;


  @Column({ nullable: true })
  beneficiary: Benef;

  @Column({ nullable: true })
  subsidy: string;

  @Column({ nullable: true })
  allowance: string;

  @Column({ nullable: true })
  other: string;

  @Column({ nullable: true })
  paid: ListPaid;

  @Column({ nullable: true, type: 'int' })
  parentId: number;

  @Column({ nullable: true, type: 'int' })
  categoryId: number;

  @Column({ nullable: true })
  display: boolean;

  @Column({ nullable: true, type: 'int' })
  yearId: number;

  @Column({ nullable: true })
  provinceId: number;
}
