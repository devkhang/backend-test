import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import { EntityManager, getManager, Repository } from "typeorm";
import { Form } from "./form.entity";

@Injectable()
export class FormService extends BaseService<Form> {
  manager: EntityManager;
  constructor(
    @InjectRepository(Form)
    private readonly doetRepository: Repository<Form>,
  ) {
    super(doetRepository, (data) => new Form(data));
    this.manager = getManager();
  }
}
