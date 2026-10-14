import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import { EntityManager, getManager, In, Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService extends BaseService<Category> {
  manager: EntityManager;
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>,
  ) {
    super(CategoryRepository, (data) => new Category(data));
    this.manager = getManager();
  }
}
