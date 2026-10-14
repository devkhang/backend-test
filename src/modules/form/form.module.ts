import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormController } from "./form.controller";
import { Form } from "./form.entity";
import { FormService } from "./form.service";

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  providers: [FormService],
  controllers: [FormController]
})
export class FormModule {
}

export enum type {
  "NghiQuyet", //Nghị quyết
  "NghiDinh", //Nghị định
  "QuyetDinh", //Quyết định
  "ChiThi", //Chỉ thị
  "ThongTu", //Thông tư
  "KienNghi", //Kiến nghị
  "CongVan", //Công văn
  "ThongBao", //Thông báo
  "CongDien", //Công điện
  "Khac", //Khác
}
