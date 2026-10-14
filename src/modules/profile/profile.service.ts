import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/commons";
import Response, { ResponseData } from "src/commons/response";
import { EntityManager, getManager, In, Repository } from "typeorm";
import { Profile } from "./profile.entity";
import { Preferential } from "../preferential/preferential.entity";
import * as argon from "argon2";
import { Workbook } from "exceljs";
import { Stream } from "stream";
import { Doet } from "../doet/doet.entity";

@Injectable()
export class ProfileService extends BaseService<Profile> {
  manager: EntityManager;

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Preferential)
    private readonly preferRepository: Repository<Preferential>
  ) {
    super(profileRepository, (data) => new Profile(data));
    this.manager = getManager();
  }

  async checkCode(code: string, doet: Doet): Promise<any> {
    try {
      let infos;
      let infoNCC;
      let address;
      let beneficiaries;
      const profile = await this.profileRepository.findOne({
        where: {
          code,
          doet_id: doet.id
        }
      });
      if (profile) {
        infos = await this.manager.query(`select id
                                         from infos
                                         where "profileId" = ${profile.id}
                                           and "deletedAt" is null limit 1`);
        infos = infos.length > 0 ? infos[0].id : null;
        address = await this.manager.query(`select id
                                            from "infoAddress"
                                            where "profileId" = ${profile.id}
                                              and "deletedAt" is null limit 1`);
        address = address.length > 0 ? address[0].id : null;
        beneficiaries = await this.manager.query(`select id
                                                  from "infoBeneficiaries"
                                                  where "profileId" = ${profile.id}
                                                    and status = true
                                                    and "deletedAt" is null limit 1`);
        beneficiaries = beneficiaries.length > 0 ? beneficiaries[0].id : null;
        infoNCC = await this.manager.query(`select id
                                                  from "infoNccs"
                                                  where "profileId" = ${profile.id}
                                                    and "deletedAt" is null limit 1`);
        infoNCC = infoNCC.length > 0 ? infoNCC[0].id : null;
      }
      return {
        code,
        isExisted: !!profile,
        profile: profile ? profile.id : null,
        info: infos,
        infoNCC: infoNCC,
        address: address,
        beneficiaries: beneficiaries
      };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async addPrefers(id: number, ids: number[]): Promise<ResponseData<Profile>> {
    try {
      const [profile, prefers] = await Promise.all([
        this.profileRepository.findOne(id),
        this.preferRepository.find({
          where: { id: In(ids) }
        })
      ]);

      if (!profile || prefers.length === 0) {
        throw Response.errorNotFound(Response.NOT_FOUND("Item"));
      }

      profile.prefers = prefers;

      const result = await this.profileRepository.save(profile);
      return Response.get(result);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async changePassword(user, oldPassword, newPassword) {
    try {
      const _user = await this.manager.query(`select password
                                              from users
                                              where id = '${user.id}'`);
      if (!_user.length || !await argon.verify(_user[0].password, oldPassword))
        return Response.errorBad("Wrong old new password");
      const _newPassword = await argon.hash(newPassword);
      await this.manager.query(`update users
                                set password = '${_newPassword}'
                                where id = '${user.id}'`);
      return Response.SUCCESSFULLY;
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async import(file, type) {
    try {
      const manager = this.manager;
      const getPlaceByText = this.getPlaceByText;
      await new Promise(function(resolve, reject) {
        const workbook = new Workbook();
        let stream = new Stream.Readable();
        stream.push(file.buffer);
        stream.push(null);
        workbook
          .xlsx
          .read(stream)
          .then(async () => {
            const worksheet = workbook.getWorksheet("Sheet1");
            const startFrom = 7;
            let readRow = true;
            let atRow = 0;
            while (readRow) {
              let row = worksheet.findRow(atRow + startFrom);
              if (row.getCell(1).value) {
                const checkExist = await manager.query(`select code
                                                        from profiles
                                                        where code = '${row.getCell(2).value}'`);
                if (checkExist.length === 0) {
                  await manager.query(`insert into profiles (code, "fullName", gender, "nativePlace", "placeOfPermanent", "categoryId")
                                       values ('${row.getCell(2).value}', '${row.getCell(3).value}', '${row.getCell(4).value === "Nam" ? 0 : 1}', '${row.getCell(5).value}', '${await getPlaceByText(row.getCell(6).value, row.getCell(7).value, row.getCell(8).value)}', ${parseInt(type)})`);
                  switch (type) {
                    case "3":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "4":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "5":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "6":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "11":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "1":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "2":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "8":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "13":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "9":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "7":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "10":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                    case "14":
                      await manager.query(`insert into infos (code, "profileId")
                                           values ('${row.getCell(2).value}', (select id from profiles where code = '${row.getCell(2).value}' limit 1) )`);
                      break;
                  }
                }
                atRow++;
              } else
                readRow = false;
            }
            resolve("done");
          });
      });
      return Response.SUCCESSFULLY;
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async getPlaceByText(province = null, district = null, ward = null) {
    let address = {
      province: {
        id: null,
        name: null
      },
      district: {
        id: null,
        name: null
      },
      ward: {
        id: null,
        name: null
      }
    };
    const manager = getManager();
    if (province) {
      const _province = await manager.query(`select id, name
                                             from provinces
                                             where name ilike '${province}'`);
      if (_province.length !== 0) {
        address.province = {
          id: _province[0].id,
          name: _province[0].name
        };
      }
    }
    if (district) {
      const _district = await manager.query(`select id, name
                                             from districts
                                             where name ilike '${district}'`);
      if (_district.length !== 0) {
        address.district = {
          id: _district[0].id,
          name: _district[0].name
        };
      }
    }
    if (ward) {
      const _ward = await manager.query(`select id, name
                                         from wards
                                         where name ilike '${ward}' and "districtId" = '${address?.district?.id}'`);
      if (_ward.length !== 0) {
        address.ward = {
          id: _ward[0].id,
          name: _ward[0].name
        };
      }
    }
    return JSON.stringify(address);
  }

  async prefers(profileId, prefersId, data) {
    try {
      const profile = await this.profileRepository.findOne({
        where: {
          id: profileId
        }
      });

      const preferIndex = profile.prefers.findIndex((obj => +obj.id === +prefersId));
      profile.prefers[preferIndex] = {
        ...profile.prefers[preferIndex],
        ...data
      };

      await this.profileRepository.save(profile);
      return Response.SUCCESSFULLY;
    } catch (e) {
      return Response.errorInternal(e);
    }
  }
}

