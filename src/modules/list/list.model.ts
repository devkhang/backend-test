import { Gender, ListPaid } from '../profile/profile.model';

export enum Type {
  Paid,
  Excute,
}

export enum Status {
  NotAprroved,
  Approved,
  Paid,
  Complete,
}

export enum ExcuteUnit {
  City,
  District,
  Ward,
}

export class ListProfile {
  id: number;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  prefers: string;
  subsidy: string;
  allowance: string;
  paid: ListPaid;
  paidMoney: string;
  receiveDate: Date;
  constructor(profile: Partial<ListProfile>) {
    Object.assign(this, profile);
  }
}
