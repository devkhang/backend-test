import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoBeneficiaryController } from './infoBeneficiary.controller';
import { InfoBeneficiary } from './infoBeneficiary.entity';
import { InfoBeneficiaryService } from './infoBeneficiary.service';

@Module({
  imports: [TypeOrmModule.forFeature([InfoBeneficiary])],
  providers: [InfoBeneficiaryService],
  controllers: [InfoBeneficiaryController],
})
export class InfoBeneficiaryModule {}
