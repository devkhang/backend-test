import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query, Req,
  UseGuards,
  UseInterceptors,
  UploadedFile, Request
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  BaseController,
  ResponseData,
  ResponseInterceptor
} from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { ProfileService } from "./profile.service";
import { Profile } from "./profile.entity";

@ApiTags("Profiles")
@Controller("profiles")
@UseGuards(AuthGuard)
export class ProfileController extends BaseController<Profile, ProfileService> {
  constructor(private readonly profileService: ProfileService) {
    super(profileService);
  }

  @Get("checkCode")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async checkCode(
    @Query("code") code: string,
    @Request() req
  ): Promise<{ code: string; isExisted: boolean }> {
    return await this.profileService.checkCode(code, req.doet);
  }

  @Post(":id/addPrefers")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Create prefer to profile" })
  async addPrefers(
    @Param("id") id: number,
    @Body("ids") ids: number[]
  ): Promise<ResponseData<Profile>> {
    return await this.profileService.addPrefers(id, ids);
  }

  @Post("change-password")
  @ApiOperation({ summary: "Change password user" })
  async changePassword(
    @Req() req: any,
    @Body() body: {
      old_password: string;
      new_password: string;
    }
  ) {
    return await this.profileService.changePassword(req.user, body.old_password, body.new_password);
  }

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Import NCC from file" })
  async import(
    @UploadedFile() file,
    @Query() query: {
      type: string;
    }
  ) {
    return await this.profileService.import(file, query.type);
  }

  @Post(":profileId/prefer/:prefersId")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "get lists for user" })
  async user(
    @Param("profileId") profileId: string,
    @Param("prefersId") prefersId: string,
    @Body() body: {
      data: any;
    }
  ): Promise<any> {
    return await this.profileService.prefers(profileId, prefersId, body.data);
  }

  // @Post(":id/prefers")
  // @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  // @ApiOperation({ summary: "Create prefer to profile" })
  // async addPrefers(
  //   @Param("id") id: number,
  //   @Body("ids") ids: number[]
  // ): Promise<ResponseData<Profile>> {
  //   return await this.profileService.addPrefers(id, ids);
  // }
}
