import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, ProfilePrefers } from './profile.entity';
import { Info } from '../info/info.entity';
import { InfoNcc } from '../infoNcc/infoNcc.entity';
import { Preferential } from '../preferential/preferential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Info, InfoNcc, Preferential, ProfilePrefers])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {
}
