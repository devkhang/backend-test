import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { EthnicModule } from "./ethnic.module";
import { EthnicService } from "./ethnic.service";

@ApiTags("Ethnic")
@Controller("ethnic")
@UseGuards(AuthGuard)
export class EthnicController extends BaseController<EthnicModule, EthnicService> {
  constructor(private readonly ethnicService: EthnicService) {
    super(ethnicService);
  }
}
