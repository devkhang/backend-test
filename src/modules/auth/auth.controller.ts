import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Body, Req, Get, Query
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseData, ResponseInterceptor } from "src/commons";
import { LocalAuthGuard } from "src/commons/guards/localAuthGuard";
import { LoginModel } from "./auth.model";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({
    summary: "Login with username and password"
  })
  async login(@Request() req): Promise<ResponseData<LoginModel>> {
    return this.authService.login(req.user, req.doet);
  }

  @Post("forgot-password")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({
    summary: "forgot password"
  })
  async forgotPasswrod(
    @Body("email") email: string,
    @Req() req: any
  ): Promise<any> {
    const domain = req.get("origin") || req.get("host");
    return this.authService.forgotPassword(email, domain);
  }

  @Get("reset-password")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({
    summary: "reset password"
  })
  async resetPassword(
    @Query("code") code: string
  ): Promise<any> {
    return this.authService.resetPassword(code);
  }
}
