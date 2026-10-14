import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import { EntityManager, getManager, Repository } from "typeorm";
import { InsuranceEntity } from "./insurance.entity";

@Injectable()
export class InsuranceService extends BaseService<InsuranceEntity> {
  manager: EntityManager;
  constructor(
    @InjectRepository(InsuranceEntity)
    private readonly insuranceRepository: Repository<InsuranceEntity>,
  ) {
    super(insuranceRepository, (data) => new InsuranceEntity(data));
    this.manager = getManager();
  }
}
