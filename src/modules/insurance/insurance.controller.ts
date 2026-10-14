import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { InsuranceEntity } from "./insurance.entity";
import { InsuranceService } from "./insurance.service";

@ApiTags("insurance")
@Controller("insurance")
@UseGuards(AuthGuard)
export class InsuranceController extends BaseController<InsuranceEntity, InsuranceService> {
  constructor(private readonly insuranceService: InsuranceService) {
    super(insuranceService);
  }
}
