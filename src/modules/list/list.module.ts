import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/profile.entity';
import { ListController } from './list.controller';
import { List, ListProfiles } from './list.entity';
import { ListService } from './list.service';

@Module({
  imports: [TypeOrmModule.forFeature([List, Profile, ListProfiles])],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
