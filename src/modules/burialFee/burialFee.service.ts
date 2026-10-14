import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import { EntityManager, getManager, In, Repository } from "typeorm";
import { burialFee } from "./burialFee.entity";

@Injectable()
export class BurialFeeService extends BaseService<burialFee> {
  manager: EntityManager;
  constructor(
    @InjectRepository(burialFee)
    private readonly doetRepository: Repository<burialFee>,
  ) {
    super(doetRepository, (data) => new burialFee(data));
    this.manager = getManager();
  }
}
