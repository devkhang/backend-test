import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import { EntityManager, getManager, In, Repository } from "typeorm";
import { EthnicEntity } from "./ethnic.entity";

@Injectable()
export class EthnicService extends BaseService<EthnicEntity> {
  manager: EntityManager;

  constructor(
    @InjectRepository(EthnicEntity)
    private readonly ethnicRepository: Repository<EthnicEntity>
  ) {
    super(ethnicRepository, (data) => new EthnicEntity(data));
    this.manager = getManager();
  }
}
