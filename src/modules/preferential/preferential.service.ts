import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService, ResponseData } from "src/commons";
import Response from "src/commons/response";
import {
  EntityManager,
  getManager,
  In,
  Repository,
  UpdateResult
} from "typeorm";
import { CurrentUser } from "../auth/auth.model";
import { Preferential } from "./preferential.entity";
import { parseInt } from "lodash";

@Injectable()
export class PreferService extends BaseService<Preferential> {
  manager: EntityManager;

  constructor(
    @InjectRepository(Preferential)
    private readonly preferRepository: Repository<Preferential>
  ) {
    super(preferRepository, (data) => new Preferential(data));
    this.manager = getManager();
  }

  async changeDisplay(
    currentUser: CurrentUser,
    ids: number[]
  ): Promise<ResponseData<UpdateResult[]>> {
    try {
      const data = await this.preferRepository.find({
        where: { id: In(ids) }
      });

      const result = [];

      for (const x of data) {
        const rs = await this.preferRepository.update(
          { id: x.id },
          {
            ...x,
            display: !x.display,
            updatedAt: new Date(),
            updatedBy: currentUser.id
          }
        );
        if (result.length === 0) {
          result.push(rs);
        } else {
          result[0].affected += rs.affected;
        }
      }

      return Response.get<UpdateResult[]>(result);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async clone(from_year: string, to_year: string) {
    try {
      const ids = [];
      const allPrefer = await this.preferRepository.find({
        where: {
          yearId: from_year,
          deletedAt: null
        }
      });
      for (const prefer of allPrefer) {
        const checkExist = await this.preferRepository.count({
          where: {
            name: prefer.name,
            yearId: parseInt(to_year)
          }
        });
        if (checkExist === 0) {
          const _prefer = await this.preferRepository.save({
            name: prefer.name,
            status: prefer.status,
            price: prefer.price,
            subsidyForm: prefer.subsidyForm,
            subsidy: prefer.subsidy,
            beneficiary: prefer.beneficiary,
            allowance: prefer.allowance,
            other: prefer.other,
            paid: prefer.paid,
            categoryId: prefer.categoryId,
            display: prefer.display,
            code: prefer.code,
            yearId: parseInt(to_year)
          });
          ids[prefer.id] = _prefer.id;
        }
      }
      for (const prefer of allPrefer) {
        if (prefer.parentId && ids[prefer.parentId]) {
          await this.preferRepository.update({
            id: ids[prefer.id]
          }, {
            parentId: ids[prefer.parentId]
          });
        }
      }
      return Response.SUCCESSFULLY;
    } catch (e) {
      throw Response.errorInternal(e);
    }
  }

  async checkCategory(categoryId: string) {
    try {
      const prefer = await this.preferRepository.count({
        where: {
          categoryId: categoryId
        }
      });

      return Response.get({
        status: prefer === 0
      });
    } catch (e) {
      throw Response.errorInternal(e);
    }
  }
}
