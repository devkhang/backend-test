import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BurialFeeController } from './burialFee.controller';
import { burialFee } from './burialFee.entity';
import { BurialFeeService } from './burialFee.service';

@Module({
  imports: [TypeOrmModule.forFeature([burialFee])],
  providers: [BurialFeeService],
  controllers: [BurialFeeController],
})
export class BurialFeeModule {}
