import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InfoAddressController } from './infoAddress.controller';
import { InfoAddress } from './infoAddress.entity';
import { InfoAddressService } from './infoAddress.service';

@Module({
  imports: [TypeOrmModule.forFeature([InfoAddress])],
  providers: [InfoAddressService],
  controllers: [InfoAddressController],
})
export class InfoAddressModule {}
