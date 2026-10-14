import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import { EntityManager, getManager, In, Repository } from 'typeorm';
import { InfoNcc } from './infoNcc.entity';

@Injectable()
export class InfoNccService extends BaseService<InfoNcc> {
  manager: EntityManager;
  constructor(
    @InjectRepository(InfoNcc)
    private readonly infoNccRepository: Repository<InfoNcc>,
  ) {
    super(infoNccRepository, (data) => new InfoNcc(data));
    this.manager = getManager();
  }
}
