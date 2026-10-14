import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseData, ResponseInterceptor } from 'src/commons';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';
import { AuthGuard } from 'src/commons/guards/authGuard';

import { ProvinceService } from './province.service';

@ApiTags('province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all provinces' })
  async getAll(): Promise<ResponseData<KeyValue[]>> {
    const users = await this.provinceService.findAllProvince();
    const res: ResponseData<KeyValue[]> = {
      data: users,
    };
    return res;
  }

  @Get(':provinceId/district')
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all districts by provinceId' })
  async getAllDistrictByProvinceId(
    @Param('provinceId') provinceId: string,
  ): Promise<ResponseData<KeyValue[]>> {
    const users = await this.provinceService.findAllDistrictByProvince(
      provinceId,
    );
    const res: ResponseData<KeyValue[]> = {
      data: users,
    };
    return res;
  }

  @Get(':districtId/ward')
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get all ward by districtId' })
  async getAllWardByDistrictId(
    @Param('districtId') districtId: string,
  ): Promise<ResponseData<KeyValue[]>> {
    const users = await this.provinceService.findAllWardByDistrict(districtId);
    const res: ResponseData<KeyValue[]> = {
      data: users,
    };
    return res;
  }
}
