import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import Response, { ResponseData } from 'src/commons/response';
import { EntityManager, getManager, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { Category } from '../category/category.entity';
import { Year } from './year.entity';

@Injectable()
export class YearService extends BaseService<Year> {
  manager: EntityManager;

  constructor(
    @InjectRepository(Year)
    private readonly yearRepository: Repository<Year>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(yearRepository, (data) => new Year(data));
    this.manager = getManager();
  }

  async create(
    currentUser: CurrentUser,
    body: { year: string; unitPrice: string; unitId: number },
  ): Promise<ResponseData<Year>> {
    try {
      const { unitId } = body;

      let categories = await this.categoryRepository.find({
        where: { unitId },
        order: { name: 'DESC' },
      });

      const years = await this.yearRepository.find({ where: { unitId } });

      if (years.length > 0) {
        categories = years[years.length - 1].categories;
      }

      const item = await this.yearRepository.save(
        new Year({
          ...body,
          categories,
          createdBy: currentUser.id,
          createdAt: new Date(),
        }),
      );
      return Response.get(item);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
