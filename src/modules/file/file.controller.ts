import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ResponseData, ResponseInterceptor } from 'src/commons';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { File } from './file.entity';
import { createFile } from './file.model';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller('profile/files')
@UseGuards(AuthGuard)
export class FileController extends BaseController<File, FileService> {
  constructor(private readonly fileService: FileService) {
    super(fileService);
  }

  @Post()
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  async post(
    @Req() req: any,
    @Body() body: createFile,
  ): Promise<ResponseData<File>> {
    return await this.fileService.createFile(req.user, body);
  }

  @Get(':id')
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get detail item' })
  async getFilePublic(@Param('id') id: number): Promise<ResponseData<File[]>> {
    return await this.fileService.getFilePublic(id);
  }
}
