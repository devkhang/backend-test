import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons';
import Response from 'src/commons/response';
import { EntityManager, getManager, In, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { InfoBeneficiary } from './infoBeneficiary.entity';

@Injectable()
export class InfoBeneficiaryService extends BaseService<InfoBeneficiary> {
  manager: EntityManager;
  constructor(
    @InjectRepository(InfoBeneficiary)
    private readonly infoBeneficiaryRepository: Repository<InfoBeneficiary>,
  ) {
    super(infoBeneficiaryRepository, (data) => new InfoBeneficiary(data));
    this.manager = getManager();
  }

  async create(currentUser: CurrentUser, body): Promise<any> {
    try {
      const item = await this.infoBeneficiaryRepository.save(
        new InfoBeneficiary({
          ...body,
          createdAt: new Date(),
          createdBy: currentUser.id,
        }),
      );

      await this.manager.query(`
        update "infoBeneficiaries" set status = false where id not in ('${item.id}') and "profileId" = ${body.profile}
      `);

      return Response.get<InfoBeneficiary>(item);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
