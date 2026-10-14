import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { InfoAddress } from './infoAddress.entity';
import { InfoAddressService } from './infoAddress.service';

@ApiTags('InfoAddress')
@Controller('profile/infoAddress')
@UseGuards(AuthGuard)
export class InfoAddressController extends BaseController<
  InfoAddress,
  InfoAddressService
> {
  constructor(private readonly infoAddressService: InfoAddressService) {
    super(infoAddressService);
  }
}
