import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { District } from './district.entity';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

import * as data from '../../commons/constant/province.json';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';
import { ProvinceModel } from './province.model';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async findAllProvince(): Promise<KeyValue[]> {
    const provinces = await this.provinceRepository.find({
      order: { name: 'ASC' },
    });
    return provinces.map((item) => {
      return new KeyValue({
        key: item.id.toString(),
        value: item.name,
      });
    });
  }

  async findAllDistrictByProvince(provinceId: string): Promise<KeyValue[]> {
    const district = await this.districtRepository.find({
      where: { province: { id: provinceId } },
      order: { name: 'ASC' },
    });
    return district.map((item) => {
      return new KeyValue({
        key: item.id.toString(),
        value: item.name,
      });
    });
  }

  async findAllWardByDistrict(districtId: string): Promise<KeyValue[]> {
    const wards = await this.wardRepository.find({
      where: { district: { id: districtId } },
      order: { name: 'ASC' },
    });
    return wards.map((item) => {
      return new KeyValue({
        key: item.id.toString(),
        value: item.name,
      });
    });
  }

  async initProvinceData() {
    const provinces = plainToClass(ProvinceModel, data);

    const provinceEntities = provinces.map((item) => {
      const province = new Province({
        id: item.id,
        name: item.name,
        type: item.type,
        cities: item.cities.map((city) => {
          return new District({
            id: city.id,
            name: city.name,
            type: city.type,
            districts: city.districts.map((district) => {
              return new Ward({
                id: district.id,
                name: district.name,
                type: district.type,
              });
            }),
          });
        }),
      });
      return province;
    });

    const requestUpsertProvince = provinceEntities.map((item) =>
      this.provinceRepository.save(item),
    );

    await Promise.all([...requestUpsertProvince]);
  }
}
