import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InfoController } from './info.controller';
import { Info } from './info.entity';
import { InfoService } from './info.service';

@Module({
  imports: [TypeOrmModule.forFeature([Info])],
  providers: [InfoService],
  controllers: [InfoController],
})
export class InfoModule {}
