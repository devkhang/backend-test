import { ApiProperty } from '@nestjs/swagger';

export class Files {
  id: string;
  name: string;
  url: string;
}

export class createFile {
  @ApiProperty({
    description: `Mẫu LT3`,
    name: 'LT3',
    required: false,
  })
  LT3: Files[];

  @ApiProperty({
    description: `Mẫu TKN3`,
    name: 'TKN3',
    required: false,
  })
  TKN3: Files[];

  @ApiProperty({
    description: `Bảng tổ quốc ghi công`,
    name: 'TQGCfile',
    required: false,
  })
  TQGCfile: Files[];

  @ApiProperty({
    description: `Giấy báo tử`,
    name: 'deathFile',
    required: false,
  })
  deathFile: Files[];

  @ApiProperty({
    description: `Quyết định phong tặng`,
    name: 'decidedFile',
    required: false,
  })
  decidedFile: Files[];

  @ApiProperty({
    description: `Giấy chứng nhận bị thương`,
    name: 'injuredFile',
    required: false,
  })
  injuredFile: Files[];

  @ApiProperty({
    description: `Bảng giám định `,
    name: 'assessmentFile',
    required: false,
  })
  assessmentFile: Files[];

  @ApiProperty({
    description: `Giấy tờ chứng minh thời kháng chiến`,
    name: 'revolutionFile',
    required: false,
  })
  revolutionFile: Files[];

  @ApiProperty({
    description: `Giấy tờ hình thức khen thưởng`,
    name: 'rewardFile',
    required: false,
  })
  rewardFile: Files[];

  @ApiProperty({
    description: `Giấy tờ khác`,
    name: 'other',
    required: false,
  })
  other: Files[];
}
