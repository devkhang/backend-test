import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, ResponseData } from 'src/commons';
import Response from 'src/commons/response';
import { EntityManager, getManager, In, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { Info } from './info.entity';
import { CreateInfo } from './info.model';

@Injectable()
export class InfoService extends BaseService<Info> {
  manager: EntityManager;
  constructor(
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
  ) {
    super(infoRepository, (data) => new Info(data));
    this.manager = getManager();
  }

  async create(
    currentUser: CurrentUser,
    body: CreateInfo,
  ): Promise<ResponseData<Info>> {
    try {
      const item = new Info({
        ...body,
        createdBy: currentUser.id,
        createdAt: new Date(),
      });
      const result = await this.infoRepository.save(item);

      return Response.get(result);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
