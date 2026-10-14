import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { dbOptions, load } from "./config";
import { AuthModule } from "./modules/auth/auth.module";
import { RoleModule } from "./modules/role/role.module";
import { UserModule } from "./modules/user/user.module";
import { YearModule } from "./modules/year/year.module";
import { ViewModule } from "./modules/view/view.module";
import { CategoryModule } from "./modules/category/category.module";
import { DoetModule } from "./modules/doet/doet.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { ProvinceModule } from "./modules/provinces/province.module";
import { InfoModule } from "./modules/info/info.module";
import { InfoNccModule } from "./modules/infoNcc/infoNcc.module";
import { MediaModule } from "./modules/media/media.module";
import { FileModule } from "./modules/file/file.module";
import { InfoBeneficiaryModule } from "./modules/infoBeneficiary/infoBeneficiary.module";
import { InfoAddressModule } from "./modules/infoAddress/infoAddress.module";
import { PreferModule } from "./modules/preferential/preferential.module";
import { ReportModule } from "./modules/report/report.module";
import { ListModule } from "./modules/list/list.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { EthnicModule } from "./modules/ethnic/ethnic.module";
import { DomainMiddleware } from "./commons/middleware/domain.middleware";
import { BurialFeeModule } from "./modules/burialFee/burialFee.module";
import { InsuranceModule } from "./modules/insurance/insurance.module";
import { FormModule } from "./modules/form/form.module";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [load] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbOptions,
      inject: [ConfigService]
    }),
    ListModule,
    ReportModule,
    PreferModule,
    InfoBeneficiaryModule,
    FileModule,
    MediaModule,
    InfoAddressModule,
    InfoNccModule,
    InfoModule,
    ProvinceModule,
    ProfileModule,
    DoetModule,
    ViewModule,
    AuthModule,
    UserModule,
    RoleModule,
    YearModule,
    CategoryModule,
    DashboardModule,
    EthnicModule,
    BurialFeeModule,
    InsuranceModule,
    FormModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainMiddleware).forRoutes("*");
  }
}
