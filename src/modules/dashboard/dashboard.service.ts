import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import { EntityManager, getManager, IsNull, LessThan, Like, MoreThan, Repository } from "typeorm";
import { Year } from "../year/year.entity";
import { DashboardEntity } from "./dashboard.entity";
import { Doet } from "../doet/doet.entity";
import { Profile } from "../profile/profile.entity";
import Response from "../../commons/response";
import { List } from "../list/list.entity";
import { Province } from "../provinces/province.entity";

@Injectable()
export class DashboardService extends BaseService<DashboardEntity> {
  manager: EntityManager;

  constructor(
    @InjectRepository(DashboardEntity)
    private readonly dashboardRepository: Repository<DashboardEntity>
  ) {
    super(dashboardRepository, (data) => new DashboardEntity(data));
    this.manager = getManager();
  }

  public async countNCC(doet: Doet) {
    const data = await this.manager.count(Profile, {
      where: {
        doet_id: doet.id,
        deletedAt: IsNull()
      }
    });
    return {
      count: data
    };
  }

  public async countProfileUncomplete(doet: Doet) {
    const data = await this.manager.count(Profile, {
      where: {
        point: LessThan(4),
        doet_id: doet.id,
        deletedAt: IsNull()
      }
    });
    return {
      count: data
    };
  }

  public async countProfileComplete(doet: Doet) {
    const data = await this.manager.count(Profile, {
      where: {
        point: MoreThan(3),
        doet_id: doet.id,
        deletedAt: IsNull()
      }
    });
    return {
      count: data
    };
  }

  public async monthlyExprnses(year, doet: Doet) {
    const t1 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '1/${year}'`)
      .getOne();
    const t2 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '2/${year}'`)
      .getOne();
    const t3 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '3/${year}'`)
      .getOne();
    const t4 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '4/${year}'`)
      .getOne();
    const t5 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '5/${year}'`)
      .getOne();
    const t6 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '6/${year}'`)
      .getOne();
    const t7 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '7/${year}'`)
      .getOne();
    const t8 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '8/${year}'`)
      .getOne();
    const t9 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '9/${year}'`)
      .getOne();
    const t10 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '10/${year}'`)
      .getOne();
    const t11 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '11/${year}'`)
      .getOne();
    const t12 = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select("sum(total::Integer)", "address")
      .where("type = 0")
      .andWhere("\"deletedAt\" IS NULL")
      .andWhere(`code = '12/${year}'`)
      .getOne();
    const _data = {
      t1: t1 && t1.address ? parseInt(t1.address) : 0,
      t2: t2 && t2.address ? parseInt(t2.address) : 0,
      t3: t3 && t3.address ? parseInt(t3.address) : 0,
      t4: t4 && t4.address ? parseInt(t4.address) : 0,
      t5: t5 && t5.address ? parseInt(t5.address) : 0,
      t6: t6 && t6.address ? parseInt(t6.address) : 0,
      t7: t7 && t7.address ? parseInt(t7.address) : 0,
      t8: t8 && t8.address ? parseInt(t8.address) : 0,
      t9: t9 && t9.address ? parseInt(t9.address) : 0,
      t10: t10 && t10.address ? parseInt(t10.address) : 0,
      t11: t11 && t11.address ? parseInt(t11.address) : 0,
      t12: t12 && t12.address ? parseInt(t12.address) : 0,
    };
    return {
      data: _data
    };
  }

  public async peopleReceivingPreferential(year: string, doet: Doet) {
    try {
      const yearIndex = {};
      const _year = parseInt(year);
      const _yearE = await this.manager.findOne(Year, {
        where: {
          year: _year
        }
      });
      if (_yearE) {
        yearIndex[_yearE.id] = _year;
      }
      const _year1 = _year - 1;
      const _yearE1 = await this.manager.findOne(Year, {
        where: {
          year: _year1
        }
      });
      if (_yearE1) {
        yearIndex[_yearE1.id] = _year1;
      }
      const _year2 = _year - 2;
      const _yearE2 = await this.manager.findOne(Year, {
        where: {
          year: _year2
        }
      });
      if (_yearE2) {
        yearIndex[_yearE2.id] = _year2;
      }
      const _year3 = _year - 3;
      const _yearE3 = await this.manager.findOne(Year, {
        where: {
          year: _year3
        }
      });
      if (_yearE3) {
        yearIndex[_yearE3.id] = _year3;
      }
      const _year4 = _year - 4;
      const _yearE4 = await this.manager.findOne(Year, {
        where: {
          year: _year4
        }
      });
      if (_yearE4) {
        yearIndex[_yearE4.id] = _year4;
      }
      console.log(JSON.stringify(yearIndex));
      const _data = {
        [_year4]: {
          month: 0,
          time: 0
        },
        [_year3]: {
          month: 0,
          time: 0
        },
        [_year2]: {
          month: 0,
          time: 0
        },
        [_year1]: {
          month: 0,
          time: 0
        },
        [_year]: {
          month: 0,
          time: 0
        }
      };

      const data = await this.manager.find(Profile, {
        where: {
          doet_id: doet.id
        },
        select: ["prefers"]
      });
      data.forEach(function(profile) {
        profile.prefers.forEach(function(prefer) {
          if (yearIndex[prefer.yearId] && _data[yearIndex[prefer.yearId]]) {
            if (prefer.subsidyForm === 1) {
              _data[yearIndex[prefer.yearId]].month++;
            } else {
              _data[yearIndex[prefer.yearId]].time++;
            }
          }
        });
      });
      return {
        data: _data
      };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  public async paymentProgressProvine(year, doet: Doet) {
    const listProvince = await this.manager
      .getRepository(List)
      .createQueryBuilder()
      .select('"provinceId"', "id")
      .where(`code like '%/${year}'`)
      .andWhere("\"deletedAt\" IS NULL")
      .groupBy('"provinceId"')
      .getMany();
    console.log(listProvince);
    const data = [];
    for (const _province of listProvince) {
      const province = await this.manager.count(Province, {
        where: {
          id: _province.id.toString()
        },
        select: [
          'id',
          'name'
        ]
      });
      const paid = await this.manager
        .getRepository(List)
        .createQueryBuilder()
        .select("sum(total::Integer)", "address")
        .where("type = 0")
        .andWhere(`code like '%/${year}'`)
        .andWhere(`"provinceId" = ${_province.id}`)
        .andWhere("\"deletedAt\" IS NULL")
        .getOne();
      const excute = await this.manager
        .getRepository(List)
        .createQueryBuilder()
        .select("sum(total::Integer)", "address")
        .where("type = 1")
        .andWhere(`code like '%/${year}'`)
        .andWhere(`"provinceId" = ${_province.id}`)
        .andWhere("\"deletedAt\" IS NULL")
        .getOne();
      data.push({
        province: province,
        paid: paid && paid.address ? parseInt(paid.address) : 0,
        excute: excute && excute.address ? parseInt(excute.address) : 0
      });
    }
    return {
      data: data
    };
  }

  public async doet(doet: Doet) {
    const countDoetChil = await this.manager
      .getRepository(Doet)
      .createQueryBuilder()
      .where(`"parentId" = ${doet.id}`)
      .andWhere("\"deletedAt\" IS NULL")
      .getCount();
    return {
      data: countDoetChil
    };
  }
}
