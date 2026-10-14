import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EthnicController } from "./ethnic.controller";
import { EthnicEntity } from "./ethnic.entity";
import { EthnicService } from "./ethnic.service";

@Module({
  imports: [TypeOrmModule.forFeature([EthnicEntity])],
  providers: [EthnicService],
  controllers: [EthnicController]
})
export class EthnicModule {
}
