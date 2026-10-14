import { Controller, Get, Query, Res } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ReportService } from "./report.service";
import { Response } from "express";
import { ExportReportDto, ReportFormat } from "./report.model";
import { ListSupportService } from "./list-support.service";
import { StatisticService } from "./statistic.service";

@Controller("report")
export class ReportController {
  private listSupportService: ListSupportService;
  constructor(
    private readonly reportService: ReportService,
    private readonly statisticService: StatisticService) {
    this.listSupportService = new ListSupportService();
  }

  @Get("/exports")
  @ApiOperation({ summary: "Export data" })
  async exportReport(
    @Res() response: Response,
    @Query() query: ExportReportDto
  ) {
    const buffer = await this.reportService.render(query);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${query.template}.${ReportFormat.ZIP}`
    );
    return response.send(buffer);
  }

  @Get("/load")
  @ApiOperation({ summary: "Load data" })
  async loadReport(
    @Res() response: Response,
    @Query() query: ExportReportDto
  ) {
    const buffer = await this.reportService.render(query);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${query.template}.${ReportFormat.ZIP}`
    );
    return response.send(buffer);
  }

  @Get("/list-support")
  @ApiOperation({ summary: "Export data" })
  async listSupport(
    @Query() query: {
      year: number,
      provinceId: number,
      type: number,
    },
    @Res() response: Response
  ) {
    const buffer = await this.listSupportService.export(query);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=list.xlsx`
    );
    return response.send(buffer);
  }

  @Get("/statistic")
  @ApiOperation({ summary: "statistic Export data" })
  async statistic(
    @Query() query: {
      start: string,
      end: string,
      type: string,
      doet_id: string
    },
    @Res() response: Response
  ) {
    const buffer = await this.statisticService.export(query.start, query.end, query.type, query.doet_id);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=list.xlsx`
    );
    return response.send(buffer);
  }
}
