import { ApiProperty } from "@nestjs/swagger";

export enum ReportFormat {
  DOCX = "docx",
  ZIP = "zip",
}

export enum ReportTemplate {
  AH1 = "AH1",
  AH2 = "AH2",
  AH3 = "AH3",
  AH4 = "AH4",
  BB1 = "BB1",
  BB2 = "BB2",
  BB3 = "BB3",
  BB4 = "BB4",
  BM1 = "BM1",
  BM2 = "BM2",
  BM3 = "BM3",
  BM4 = "BM4",
  KC1 = "KC1",
  KC2 = "KC2",
  LS1 = "LS1",
  LS2 = "LS2",
  LS3 = "LS3",
  LS4 = "LS4",
  LS5 = "LS5",
  LS6 = "LS6",
  LT1 = "LT1",
  LT2 = "LT2",
  LT3 = "LT3",
  LT4 = "LT4",
  LT5 = "LT5",
  TB1 = "TB1",
  TB2 = "TB2",
  TB3 = "TB3",
  TB4 = "TB4",
  TB5 = "TB5",
  TB6 = "TB6",
  TD1 = "TD1",
  TD2 = "TD2",
  TD3 = "TD3",
  TD4 = "TD4",
  TD5 = "TD5",
  TKN1 = "TKN1",
  TKN2 = "TKN2",
  TKN3 = "TKN3",
  TKN4 = "TKN4",
  TKN5 = "TKN5",
}

export class ExportReportDto {
  ids: string;
  template: string;
}
