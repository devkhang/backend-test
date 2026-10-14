import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController extends BaseController<
  Category,
  CategoryService
> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
