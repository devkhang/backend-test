import { ApiProperty } from '@nestjs/swagger';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';

export enum Gender {
  female,
  male,
}
export class PlaceOfPermanent {
  address: string;
  ward: KeyValue;
  district: KeyValue;
  province: KeyValue;
}

export class Transfer {
  decided: string;
  person: string;
  organ: string;
  date: Date;
  moveIn: string;
  transfer: string;
  deletedAt: Date;
  file: string[];
  ward: KeyValue;
  district: KeyValue;
  province: KeyValue;
  type: Move;
}

export enum ListPaid {
  Added,
  Paid,
}

export enum Move {
  MoveIn,
  Transfer,
}

export enum TypeMtp {
  UsedTo,
  Not,
}
export class Info {
  @ApiProperty({
    description: `code`,
    name: 'code',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: `Ngày vào đảng`,
    name: 'dateJoinClan',
    required: false,
  })
  dateJoinClan: Date;

  @ApiProperty({
    description: `Ngày chính thức`,
    name: 'date',
    required: false,
  })
  date: Date;

  @ApiProperty({
    description: `Nguyên là`,
    name: 'position',
    required: false,
  })
  position: string;

  @ApiProperty({
    description: `Cơ quan`,
    name: 'organ',
    required: false,
  })
  organ: string;

  @ApiProperty({
    description: `Thời gian nghỉ hưu`,
    name: 'retire',
    required: false,
  })
  retire: Date;

  @ApiProperty({
    description: `Ngày bắt đầu tham gia cách mạng`,
    name: 'revolution',
    required: false,
  })
  startDateRevolution: Date;

  @ApiProperty({
    description: `Ngày kết thúc tham gia cách mạng`,
    name: 'revolution',
    required: false,
  })
  endDateRevolution: Date;

  @ApiProperty({
    description: `Chức vụ trước CMT8/1945`,
    name: 'time',
    required: false,
  })
  roleRevolution: string;

  @ApiProperty({
    description: `Thời gian giữ chức vụ trước CMT8/1945`,
    name: 'takeOfficeDate',
    required: false,
  })
  takeOfficeDate: string;

  @ApiProperty({
    description: `Quá trình tham gia hoạt động cách mạng`,
    name: 'inprogress',
    required: false,
  })
  inprogress: {
    content: string;
    categoryCode: number;
  };

  @ApiProperty({
    description: `Số bằng TQGC`,
    name: 'degree',
    required: false,
  })
  degree: {
    degree: string;
    categoryCode: number;
  };

  @ApiProperty({
    description: `Số quyết định TQGC`,
    name: 'degree',
    required: false,
  })
  decided: {
    decided: string;
    categoryCode: number;
  };

  @ApiProperty({
    description: `Thời gian cấp bằng`,
    name: 'timeDegree',
    required: false,
  })
  timeDegree: {
    date: Date;
    categoryCode: number;
  };

  @ApiProperty({
    description: `Cơ quan quản lí hồ sơ gốc`,
    name: 'organManager',
    required: false,
  })
  organManager: {
    organ: string;
    categoryCode: number;
  };
}

export class InfoNcc {
  fullName: string;
  dateOfBirth: Date;
  gender: number;
  identityCard: string;
  date: Date;
  place: string;
}

export class InfoAddress {
  nativePlace: string;
  placeOfPermanent: PlaceOfPermanent;
}

export class InfoBeneficiary {
  infoBeneficiary: boolean;
  infoRelative: boolean;
  fullName: string;
  dateOfBirth: Date;
  gender: number;
  IdentityCard: string;
  date: Date;
  place: string;
  nativePlace: string;
  placeOfPermanent: {
    ward: KeyValue;
    district: KeyValue;
    province: KeyValue;
  };
  dateOfNccDeath: Date;
  ralationNcc: string;
}

export class ProfileModel {
  id: number;
  code: string;
  fullName: string;
  dateOfBirth: Date;
  gender: number;
  nativePlace: string;
  placeOfPermanent: PlaceOfPermanent;
  address: string;

  constructor(
    profile?: Partial<ProfileModel>,
    keys: string[] = [
      'id',
      'code',
      'fullName',
      'dateOfBirth',
      'gender',
      'nativePlace',
      'placeOfPermanent',
      'address',
    ],
  ) {
    profile &&
      keys.forEach((key) => {
        profile[key] !== undefined && (this[key] = profile[key]);
      });
  }
}

export enum Point {
  info,
  infoNcc,
  infoAddress,
  file,
  infoBeneficiary,
  preferential,
  moveIn,
  transfer,
  mtp,
}

export class Other {
  decidedDate: Date;
  decided: string;
  newspaperMoney: string;
  allowance: string;
  decidedDateOnce: Date;
  decidedOnce: string;
  startDate: Date;
}

export class GetList {
  code: string;
  fullNameNcc: string;
  dob: Date;
  prefer: string;
  benef: string;
  relation: string;
}
