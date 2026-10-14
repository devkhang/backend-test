import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { burialFee } from "./burialFee.entity";
import { BurialFeeService } from "./burialFee.service";

@ApiTags("burial")
@Controller("burial")
@UseGuards(AuthGuard)
export class BurialFeeController extends BaseController<burialFee, BurialFeeService> {
  constructor(private readonly doetService: BurialFeeService) {
    super(doetService);
  }
}
