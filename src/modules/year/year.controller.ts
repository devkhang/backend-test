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
import { Year } from './year.entity';
import { YearService } from './year.service';

@ApiTags('Years')
@Controller('years')
@UseGuards(AuthGuard)
export class YearController extends BaseController<Year, YearService> {
  constructor(private readonly yearService: YearService) {
    super(yearService);
  }

  @Post()
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create item' })
  async create(
    @Req() req: any,
    @Body() body: { year: string; unitPrice: string; unitId: number },
  ): Promise<ResponseData<Year>> {
    return await this.yearService.create(req.user, body);
  }
}
