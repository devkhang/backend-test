import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PreferController } from './preferential.controller';
import { Preferential } from './preferential.entity';
import { PreferService } from './preferential.service';

@Module({
  imports: [TypeOrmModule.forFeature([Preferential])],
  controllers: [PreferController],
  providers: [PreferService],
})
export class PreferModule {}
