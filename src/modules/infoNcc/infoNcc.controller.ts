import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { InfoNcc } from './infoNcc.entity';
import { InfoNccService } from './infoNcc.service';

@ApiTags('InfoNccs')
@Controller('profile/infoNccs')
@UseGuards(AuthGuard)
export class InfoNccController extends BaseController<InfoNcc, InfoNccService> {
  constructor(private readonly infoNccService: InfoNccService) {
    super(infoNccService);
  }
}
