import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InfoNccController } from './infoNcc.controller';
import { InfoNcc } from './infoNcc.entity';
import { InfoNccService } from './infoNcc.service';

@Module({
  imports: [TypeOrmModule.forFeature([InfoNcc])],
  providers: [InfoNccService],
  controllers: [InfoNccController],
})
export class InfoNccModule {}
