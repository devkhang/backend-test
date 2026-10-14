import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ResponseData, ResponseInterceptor } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { List } from './list.entity';
import { ListService } from './list.service';

@ApiTags('Lists')
@Controller('lists')
@UseGuards(AuthGuard)
export class ListController extends BaseController<List, ListService> {
  constructor(private readonly listService: ListService) {
    super(listService);
  }

  @Post(':id/addProfiles')
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get items' })
  async addPrefers(
    @Param('id') id: number,
    @Body('ids') ids: number[],
    @Query('subsidyForm') subsidyForm: number,
  ): Promise<ResponseData<List>> {
    return await this.listService.addPrefers(id, ids, subsidyForm);
  }

  @Get('checkCode')
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get items' })
  async checkCode(
    @Query('code') code: string,
  ): Promise<{ code: string; isExisted: boolean }> {
    return await this.listService.checkCode(code);
  }

  @Get("user/:userId")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "get lists for user" })
  async user(
    @Param('userId') userId: string,
  ): Promise<any> {
    return await this.listService.user(userId);
  }
}
