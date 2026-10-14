import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Category } from '../category/category.entity';
import { YearController } from './year.controller';
import { Year } from './year.entity';
import { YearService } from './year.service';

@Module({
  imports: [TypeOrmModule.forFeature([Year, Category])],
  providers: [YearService],
  controllers: [YearController],
})
export class YearModule {}
