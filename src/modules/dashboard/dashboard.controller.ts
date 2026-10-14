import { ClassSerializerInterceptor, Controller, Get, Param, Query, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseInterceptor } from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@Controller("dashboard")
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {

  }

  @Get("count-ncc")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async countNCC(
    @Request() req
  ): Promise<{ count: number }> {
    return this.dashboardService.countNCC(req.doet);
  }

  @Get("count-profile-uncomplete")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async countProfileUncomplete(
    @Request() req
  ): Promise<{ count: number }> {
    return this.dashboardService.countProfileUncomplete(req.doet);
  }

  @Get("count-profile-complete")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async countProfileComplete(
    @Request() req
  ): Promise<{ count: number }> {
    return this.dashboardService.countProfileComplete(req.doet);
  }

  @Get("monthly-expenses/:year")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async monthlyExprnses(
    @Param("year") year: string,
    @Request() req
  ): Promise<any> {
    return this.dashboardService.monthlyExprnses(year, req.doet);
  }

  @Get("people-receiving-preferential/:year")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async peopleReceivingPreferential(
    @Param("year") year: string,
    @Request() req
  ): Promise<any> {
    return this.dashboardService.peopleReceivingPreferential(year, req.doet);
  }

  @Get("payment-progress-provine/:year")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Get items" })
  async paymentProgressProvine(
    @Param("year") year: string,
    @Request() req
  ): Promise<any> {
    return this.dashboardService.paymentProgressProvine(year, req.doet);
  }

  @Get("doet")
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: "Count doet" })
  async doet(
    @Param("year") year: string,
    @Request() req
  ): Promise<any> {
    return this.dashboardService.doet(req.doet);
  }
}
