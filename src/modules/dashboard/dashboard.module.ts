import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardEntity } from './dashboard.entity';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardEntity])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
