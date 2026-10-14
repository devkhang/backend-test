import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put, Query,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ResponseData, ResponseInterceptor } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { UpdateResult } from 'typeorm';
import { Preferential } from './preferential.entity';
import { PreferService } from './preferential.service';
import { Response } from "express";

@ApiTags('Preferential')
@Controller('preferentials')
@UseGuards(AuthGuard)
export class PreferController extends BaseController<
  Preferential,
  PreferService
> {
  constructor(private readonly preferService: PreferService) {
    super(preferService);
  }

  @Put('changeDisplay')
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Edit item' })
  async changeDisplay(
    @Req() req: any,
    @Body('ids') ids: number[],
  ): Promise<ResponseData<UpdateResult[]>> {
    return await this.preferService.changeDisplay(req.user, ids);
  }

  @Post('clone')
  @ApiOperation({
    summary: "clone preferential"
  })
  async clone(
    @Body() body: {
      from_year: string;
      to_year: string;
    }
  ) {
    return await this.preferService.clone(body.from_year.toString(), body.to_year.toString());
  }

  @Get('check-category')
  @ApiOperation({
    summary: "check category | false is exist"
  })
  async checkCategory(
    @Query("id") id: string
  ) {
    return await this.preferService.checkCategory(id);
  }
}
