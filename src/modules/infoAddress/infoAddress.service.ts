import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import { EntityManager, getManager, In, Repository } from 'typeorm';
import { InfoAddress } from './infoAddress.entity';

@Injectable()
export class InfoAddressService extends BaseService<InfoAddress> {
  manager: EntityManager;
  constructor(
    @InjectRepository(InfoAddress)
    private readonly infoAddressRepository: Repository<InfoAddress>,
  ) {
    super(infoAddressRepository, (data) => new InfoAddress(data));
    this.manager = getManager();
  }
}
