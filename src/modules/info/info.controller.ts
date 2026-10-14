import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ResponseData, ResponseInterceptor } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { Info } from './info.entity';
import { CreateInfo } from './info.model';
import { InfoService } from './info.service';

@ApiTags('Infos')
@Controller('profile/infos')
@UseGuards(AuthGuard)
export class InfoController extends BaseController<Info, InfoService> {
  constructor(private readonly infoService: InfoService) {
    super(infoService);
  }

  @Post()
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  async post(
    @Req() req: any,
    @Body() body: CreateInfo,
  ) {
    return await this.infoService.create(req.user, body);
  }
}
