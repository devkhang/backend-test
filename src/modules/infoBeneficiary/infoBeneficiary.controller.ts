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
import { BaseController, ResponseInterceptor } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { InfoBeneficiary } from './infoBeneficiary.entity';
import { InfoBeneficiaryService } from './infoBeneficiary.service';

@ApiTags('Files')
@Controller('profile/infoBeneficiaries')
@UseGuards(AuthGuard)
export class InfoBeneficiaryController extends BaseController<
  InfoBeneficiary,
  InfoBeneficiaryService
> {
  constructor(private readonly infoBeneficiaryService: InfoBeneficiaryService) {
    super(infoBeneficiaryService);
  }

  @Post()
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create item' })
  async post(@Req() req: any, @Body() body): Promise<any> {
    return await this.infoBeneficiaryService.create(req.user, body);
  }
}
