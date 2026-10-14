import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/commons";
import { AuthGuard } from "src/commons/guards/authGuard";
import { Form } from "./form.entity";
import { FormService } from "./form.service";

@ApiTags("form")
@Controller("form")
@UseGuards(AuthGuard)
export class FormController extends BaseController<Form, FormService> {
  constructor(private readonly formService: FormService) {
    super(formService);
  }
}
