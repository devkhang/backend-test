import { ApiProperty } from '@nestjs/swagger';
import { TypeMtp } from './profile.model';

export class MtpDto {
  @ApiProperty({
    description: `Loại chế độ`,
    name: 'type',
    required: false,
  })
  type: TypeMtp;

  @ApiProperty({
    description: `Số quyết định`,
    name: 'decided',
    required: false,
  })
  decided: string;

  @ApiProperty({
    description: `Ngày quyết định`,
    name: 'decidedDate',
    required: false,
  })
  decidedDate: Date;

  @ApiProperty({
    description: `Người ra quyết định`,
    name: 'decidedPerson',
    required: false,
  })
  decidedPerson: string;

  @ApiProperty({
    description: `Ngày dừng trợ cấp`,
    name: 'stopDate',
    required: false,
  })
  stopDate: Date;

  @ApiProperty({
    description: `Ngày nhận trợ cấp`,
    name: 'mtpDate',
    required: false,
  })
  mtpDate: Date;

  @ApiProperty({
    description: `Số tiền mtp`,
    name: 'mtp',
    required: false,
  })
  mtp: string;

  @ApiProperty({
    description: `Year`,
    name: 'yearId',
    required: false,
  })
  yearId: number;
}
