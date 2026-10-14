import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { District } from './district.entity';
import { Province } from './province.entity';
import { Ward } from './ward.entity';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District, Ward])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
