import { ApiProperty } from '@nestjs/swagger';

export enum Reward {
  medalOfHonor1, //'Huân chương chiến thắng hạng nhất',
  medalOfHonor2, //'Huân chương chiến thắng hạng nhì',
  medalOfHonor3, //'Huân chương chiến thắng hạng ba',
  medalOfVictory1, //'Huy chương chiến thắng hạng nhất',
  medalOfVictory2, //'Huy chương chiến thắng hạng nhì',
  medalOfVictory3, //'Huy chương chiến thắng hạng ba',
  medalOfResistanceWarAgainstFrance1, //'Huân chương kháng chiến chống Pháp hạng nhất',
  medalOfResistanceWarAgainstFrance2, //'Huân chương kháng chiến chống Pháp hạng nhì',
  medalOfResistanceWarAgainstFrance3, //'Huân chương kháng chiến chống Pháp hạng ba',
  medalOfHonor, // Huân chương
  medalOfVictory, // Huy chương
  merit, // Bằng khen
}

export class inprogressRevolution {
  @ApiProperty({
    description: `Thời gian bắt đầu`,
    name: 'startDate',
    required: false,
  })
  startDate: Date;

  @ApiProperty({
    description: `Thời gian kết thúc`,
    name: 'endDate',
    required: false,
  })
  endDate: Date;

  @ApiProperty({
    description: `Cơ quan/đơn vị`,
    name: 'organ',
    required: false,
  })
  organ: string;

  @ApiProperty({
    description: `Cấp bậc/ chức vụ`,
    name: 'rank',
    required: false,
  })
  rank: string;

  @ApiProperty({
    description: `Địa bàn hoạt động`,
    name: 'area',
    required: false,
  })
  area: string;
}

export class inprogressJailed {
  @ApiProperty({
    description: `Thời gian bắt đầu`,
    name: 'startDate',
    required: false,
  })
  startDate: Date;

  @ApiProperty({
    description: `Thời gian kết thúc`,
    name: 'endDate',
    required: false,
  })
  endDate: Date;

  @ApiProperty({
    description: `Cơ quan/đơn vị`,
    name: 'organ',
    required: false,
  })
  organ: string;

  @ApiProperty({
    description: `Nơi bị tù đầy`,
    name: 'prison',
    required: false,
  })
  prison: string;
}

export class CreateInfo {
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
    description: `Nguyên là, vị trí, chức vụ`,
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
    description: `Cấp bậc`,
    name: 'rank',
    required: false,
  })
  rank: string;

  @ApiProperty({
    description: `Thời gian nghỉ hưu`,
    name: 'retire',
    required: false,
  })
  retire: Date;

  @ApiProperty({
    description: `Ngày bắt đầu tham gia cách mạng`,
    name: 'startDateRevolution',
    required: false,
  })
  startDateRevolution: Date;

  @ApiProperty({
    description: `Ngày kết thúc tham gia cách mạng`,
    name: 'endDateRevolution',
    required: false,
  })
  endDateRevolution: Date;

  @ApiProperty({
    description: `Chức vụ trước CMT8/1945`,
    name: 'roleRevolution',
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
    description: `Quá trình tham gia kháng chiến`,
    name: 'inprogressRevolution',
    required: false,
  })
  inprogressRevolution: inprogressRevolution[];

  @ApiProperty({
    description: `Quá trình bị tù đầy`,
    name: 'inprogressJailed',
    required: false,
  })
  inprogressJailed: inprogressJailed[];

  @ApiProperty({
    description: `Số bằng`,
    name: 'degree',
    required: false,
  })
  degree: string;

  @ApiProperty({
    description: `Số quyết định`,
    name: 'decided',
    required: false,
  })
  decided: string;

  @ApiProperty({
    description: `Thời gian quyết định`,
    name: 'decidedDate',
    required: false,
  })
  decidedDate: Date;

  @ApiProperty({
    description: `Cơ quan quản lí hồ sơ gốc`,
    name: 'organManager',
    required: false,
  })
  organManager: string;

  @ApiProperty({
    description: `Số giấy chứng nhận bị thương`,
    name: 'injured',
    required: false,
  })
  injured: string;

  @ApiProperty({
    description: `Ngày chứng nhận bị thương`,
    name: 'verifyDate',
    required: false,
  })
  verifyDate: Date;

  @ApiProperty({
    description: `Ngày bị thương`,
    name: 'injuredDate',
    required: false,
  })
  injuredDate: Date;

  @ApiProperty({
    description: `Hình thức khen thưởng`,
    name: 'reward',
    required: false,
  })
  reward: Reward;

  @ApiProperty({
    description: `Ghi chú`,
    name: 'note',
    required: false,
  })
  note: string;
}
