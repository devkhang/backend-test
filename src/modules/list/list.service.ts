import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService, GetAllDto, ResponseData } from "src/commons";
import Response from "src/commons/response";
import { EntityManager, getManager, In, Repository, UpdateResult } from "typeorm";
import { Profile } from "../profile/profile.entity";
import { List, ListProfiles } from "./list.entity";
import { Doet } from "../doet/doet.entity";

@Injectable()
export class ListService extends BaseService<List> {
  manager: EntityManager;

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ListProfiles)
    private readonly listProfileRepository: Repository<ListProfiles>
  ) {
    super(listRepository, (data) => new List(data));
    this.manager = getManager();
  }

  async checkCode(code: string): Promise<{ code: string; isExisted: boolean }> {
    try {
      const founded = await this.listRepository.findOne({ where: { code } });
      return {
        code,
        isExisted: !!founded
      };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async addPrefers(id: number, ids: number[], subsidyForm = null): Promise<ResponseData<any>> {
    try {
      const [list, profiles] = await Promise.all([
        this.listRepository.findOne(id),
        this.profileRepository.find({
          where: {
            id: In(ids)
          }
        })
      ]);
      if (!list || profiles.length !== ids.length) {
        throw Response.errorNotFound(Response.NOT_FOUND("Item"));
      }
      const p = [];
      profiles.forEach((profile) => {
        profile.prefers?.forEach((prefer) => {
          if (!subsidyForm || prefer.subsidyForm === +subsidyForm) {
            p.push({
              id: profile.id,
              name: profile.fullName,
              dateOfBirth: profile.dateOfBirth,
              gender: profile.gender,
              prefers: prefer.name,
              prefersId: prefer.id,
              subsidy: prefer.subsidy,
              allowance: prefer.allowance,
              paid: prefer.paid,
              categoryId: profile.categoryId
            });
          }
        });
      });
      return Response.get(p);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async user(userId: string) {
    try {
      return Response.getList(await this.manager.query(`
          select lists.id
          from lists
                   inner join lists_profiles on lists_profiles."listsId" = lists.id
                   inner join profiles on profiles.id = lists_profiles."profilesId"
          where profiles.id = ${userId}
            and profiles."deletedAt" is null
            and lists."deletedAt" is null limit 5
      `));
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async put(
    currentUser: any,
    id: string,
    itemDto: any
  ): Promise<ResponseData<any>> {
    try {
      const lists = await this.listRepository.findOne({
        where: {
          id
        }
      });
      if (!lists) {
        throw Response.errorNotFound(Response.NOT_FOUND("Item"));
      }
      if (itemDto.profiles) {
        await this.listProfileRepository
          .createQueryBuilder()
          .delete()
          .where(`"listsId" = :id`, {
            id: id
          })
          .execute();
        const profiles = await this.profileRepository.find({
          where: {
            id: In(itemDto.profiles.map(function (profile) {
              return profile.id
            }))
          }
        });
        if (profiles.length !== itemDto.profiles.length) {
          throw Response.errorNotFound(Response.NOT_FOUND("Item"));
        }
        for (const profile of itemDto.profiles) {
          await this.manager.query(`
              insert into lists_profiles ("listsId", "profilesId", "prefers")
              values (${id}, ${profile.id}, '${JSON.stringify(profile.prefers)}')
          `);
        }
        delete itemDto.profiles;
      }
      const result = await this.listRepository.update(
        id, {
          ...itemDto,
          updatedAt: new Date(),
          updatedBy: currentUser.id
        });

      return Response.get<UpdateResult>(result);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async getDetail(getAllDto: GetAllDto, id: string, doet: Doet | null): Promise<any> {
    try {
      const relations =
        (getAllDto.relation && JSON.parse(getAllDto.relation)) || null;
      const _where: {
        id: any,
        doet_id?: any
      } = {
        id: id,
        // doet_id: doet.id
      };
      const product = await this.listRepository.findOne({
        where: _where,
        relations
      });
      for (const profile of product.listProfiles) {
        profile.profiles.prefers = profile.profiles.prefers.filter(function (prefer) {
          return !(getAllDto.where === 'prefers' && !profile.prefers.includes(prefer.id));
        });
      }
      if (!product) {
        throw Response.errorNotFound(Response.NOT_FOUND("Item"));
      }

      return Response.get(product);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
