import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/profile.entity';
import { InfoBeneficiary } from '../infoBeneficiary/infoBeneficiary.entity';
import { Category } from '../category/category.entity';
import { Doet } from "../doet/doet.entity";
import { Preferential } from '../preferential/preferential.entity';
import { Year } from '../year/year.entity';
import { StatisticService } from './statistic.service';
import { ListProfiles } from '../list/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, InfoBeneficiary,Year, Category, Preferential, Doet, ListProfiles])],
  controllers: [ReportController],
  providers: [ReportService, StatisticService],
})
export class ReportModule {}
