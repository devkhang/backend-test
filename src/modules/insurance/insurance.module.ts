import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceController } from './insurance.controller';
import { InsuranceEntity } from './insurance.entity';
import { InsuranceService } from './insurance.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceEntity])],
  providers: [InsuranceService],
  controllers: [InsuranceController],
})
export class InsuranceModule {}
