import { Injectable } from "@nestjs/common";
import * as Pz from "pizzip";
import * as path from "path";
import { ExportReportDto, ReportFormat, ReportTemplate } from "./report.model";
import Response from "src/commons/response";
import * as fs from "fs";
import { In, Not, Repository } from "typeorm";
import { Profile } from "../profile/profile.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as jsz from "jszip";
import { Gender, Other, PlaceOfPermanent, TypeMtp } from "../profile/profile.model";
import { InfoBeneficiary } from "../infoBeneficiary/infoBeneficiary.entity";
import { filters } from "angular-expressions";
import { Benef } from "../preferential/preferential.entity";
import { Category } from "../category/category.entity";
import * as moment from "moment";
import { Doet } from "../doet/doet.entity";
import DocSo from "../../commons/helper/DocSo";
import { Info } from "../info/info.entity";
import { InfoNcc } from "../infoNcc/infoNcc.entity";

const Docx = require("docxtemplater");

const blank = "..............";

@Injectable()
export class ReportService {
  jszip: jsz;

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(InfoBeneficiary)
    private readonly benefRepository: Repository<InfoBeneficiary>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Doet)
    private readonly doetRepository: Repository<Doet>
  ) {
  }

  #loadProfiles = async (ids: number[]) => {
    const profiles: ProfileDTO[] = await this.profileRepository.find({
      where: {
        id: In(ids)
      },
      relations: [
        'info',
        'infoNcc',
        'infoBeneficiary'
      ]
    });
    for (const profile of profiles) {
      profile.doet = await this.getUnit(profile.doet_id);
      profile.infoBeneficiary = profile.infoBeneficiary || [];
      if (profile.infoBeneficiary?.length > 1) {
        profile.infoBeneficiary = profile.infoBeneficiary.sort((a, b) => a.id - b.id);
      }
      
      const prefers = profile.prefers || [];
      profile.totalPreferByMonth = prefers.filter(e => e.subsidyForm === 1)
        .map(e => +e.subsidy || 0)
        .reduce((a, b) => a + b, 0);
      profile.totalPreferByYear = prefers.filter(e => e.subsidyForm === 2)
        .map(e => +e.subsidy || 0)
        .reduce((a, b) => a + b, 0);
      profile.totalPreferOnce = prefers.filter(e => e.subsidyForm === 0)
        .map(e => +e.subsidy || 0)
        .reduce((a, b) => a + b, 0);

      profile.mainInfo = profile.info[0];
      profile.mainInfoNcc = profile.infoNcc[0];
      profile.mainBeneficiary = profile.infoBeneficiary.find(e => e.status) || profile.infoBeneficiary[0];
      
      const benefics = profile.infoBeneficiary?.filter?.((e, idx) => e !== profile.mainBeneficiary) || [];
      profile.aRelative = benefics.map((item, idx) => {
        return {
          ...item,
          stt: idx + 1,
          dob: this.#getDate(item?.dateOfBirth),
          present: item?.present || blank, 
          relation: item?.relation || '',
          note: item?.note || '',
          fullName: item?.fullName || blank,
          address: item?.address || blank,
        };
      });
    }
    
    return profiles;
  }

  #export = async (templateUrl: string, results: { fileName: string, [key: string]: any }[]) => {
    const jszip = new jsz();
    // Render report từ results
    for (const result of results) {
      const zip = new Pz(templateUrl);
      const doc = new Docx(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      await doc.render(result);
      jszip.file(`${result.fileName}.docx`, doc.getZip().generate({ type: "nodebuffer" }));
    }
    return await jszip.generateAsync({
      type: "nodebuffer"
    });
  }

  async render(query: ExportReportDto) {
    if (!query) {
      return null;
    }
    const { template, ids } = query;
    const listId: number[] = JSON.parse(ids) || [];
    if (!listId?.length) {
      return null;
    }
    if (template === 'BB3') {
      return await this.exportBB3(listId);
    }
    if (template === 'LT1') {
      return await this.exportLT1(listId);
    }
    if (template === 'LT2') {
      return await this.exportLT2(listId);
    }
    if (template === 'TKN1') {
      return await this.exportTKN1(listId);
    }
    if (template === 'TKN2') {
      return await this.exportTKN2(listId);
    }
    if (template === 'LS4') {
      return await this.exportLS4(listId);
    }
    if (template === 'LS5') {
      return await this.exportLS5(listId);
    }
    if (template === 'LS6') {
      return await this.exportLS6(listId);
    }
    if (template === 'BM1') {
      return await this.exportBM1(listId);
    }
    if (template === 'BM2') {
      return await this.exportBM2(listId);
    }
    if (template === 'AH1') {
      return await this.exportAH1(listId);
    }
    if (template === 'AH2') {
      return await this.exportAH2(listId);
    }
    if (template === 'HH1') {
      return await this.exportHH1(listId);
    }
    if (template === 'TD1') {
      return await this.exportTD1(listId);
    }
    if (template === 'TD2') {
      return await this.exportTD2(listId);
    }
    if (template === 'TD3') {
      return await this.exportTD3(listId);
    }
    if (template === 'HS1') {
      return await this.exportHS1(listId);
    }
    if (template === 'HS2') {
      return await this.exportHS2(listId);
    }
    if (template === 'HS3') {
      return await this.exportHS3(listId);
    }
    if (template === 'CC1') {
      return await this.exportCC1(listId);
    }
    if (template === 'LT4') {
      return await this.exportLT4(listId);
    }
    if (template === 'LT5') {
      return await this.exportLT5(listId);
    }
    if (template === 'TKN4') {
      return await this.exportTKN4(listId);
    }
    if (template === 'TKN5') {
      return await this.exportTKN5(listId);
    }
    if (template === 'BM3') {
      return await this.exportBM3(listId);
    }
    if (template === 'BM4') {
      return await this.exportBM4(listId);
    }
    if (template === 'AH3') {
      return await this.exportAH3(listId);
    }
    if (template === 'AH4') {
      return await this.exportAH4(listId);
    }
    if (template === 'HH4') {
      return await this.exportHH4(listId);
    }
    if (template === 'TD4') {
      return await this.exportTD4(listId);
    }
    if (template === 'TD5') {
      return await this.exportTD5(listId);
    }
    if (template === 'KC2') {
      return await this.exportKC2(listId);
    }
    if (template === 'CC2') {
      return await this.exportCC2(listId);
    }
    if (template === 'CC3') {
      return await this.exportCC3(listId);
    }
    if (template === 'TB3') {
      return await this.exportTB3(listId);
    }
    if (template === 'TB4') {
      return await this.exportTB4(listId);
    }
    if (template === 'HS4') {
      return await this.exportHS4(listId);
    }
    if (template === 'KC1') {
      return await this.exportKC1(listId);
    }

    let where = {
      id: In(JSON.parse(query?.ids) || [])
    };
    let relations;
    switch (query.template) {
      case "LT1":
      case "AH1":
      case "TKN1":
        relations = [
          "info"
        ];
        break;
      case "LT2":
      case "LS4":
      case "LS5":
      case "LS6":
      case "BM1":
      case "TKN2":
      case "HS4":
        relations = [
          "info",
          "infoNcc",
          "infoBeneficiary"
        ];
        break;
      case "BM2":
      case "AH2":
      case "LT5":
      case "TKN5":
      case "BM4":
      case "AH4":
      case "TD5":
      case "TT1":
      case "TT2":
        relations = [
          "info",
          "infoBeneficiary"
        ];
        break;
      case "HH1":
      case "TD1":
      case "TD2":
      case "HS3":
      case "HS2":
      case "BB3":
        relations = [
          "info",
          "infoNcc"
        ];
        break;
      case "TD3":
      case "HS1":
        relations = [
          "info",
          "infoNcc",
          "infoBeneficiary"
        ];
        break;
      case "KC1":
      case "CC1":
      case "LT4":
      case "TKN4":
      case "BM3":
      case "AH3":
      case "HH4":
      case "TD4":
      case "KC2":
      case "CC2":
      case "CC3":
      case "TB3":
      case "TB4":
        relations = [
          "info"
        ];
        break;
      default:
        throw Response.errorNotFound("Not found template");
    }
    const data = await this.profileRepository.find({
      where: where,
      relations: relations
    });
    const jszip = new jsz();
    const profiles = await this[query.template](data);
    for (const profile of profiles) {
      const content = this.#getTemplate(query.template);
      const zip = new Pz(content);
      const doc = new Docx(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      await doc.render(profile);
      const nameFile = (profile.fullName && profile.fullName !== blank)
        ? profile.fullName
        : (profile.fullNameNcc && profile.fullNameNcc !== blank)
          ? profile.fullNameNcc
          : (profile.name && profile.name !== blank)
            ? profile.name
            : profile.fullNameLS;
      await jszip.file(
        `${nameFile}.docx`,
        doc.getZip().generate({ type: "nodebuffer" })
      );
    }
    return await jszip.generateAsync({
      type: "nodebuffer"
    });
  }

  loadLT1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, info: infos } = profile;
      const info = infos[0];
      return {
        fileName: profile.fullName || 'LT1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile.fullName || blank,
        dob: this.#getDate(profile.dateOfBirth),
        gender: this.getGender(profile.gender),
        nativePlace: profile.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.#toNgayThangNam(info.retire),
        dateJoinClan: this.#toNgayThangNam(info?.dateJoinClan),
        date: this.#toNgayThangNam(info?.date),
        startDate: this.#toNgayThangNam(info?.startDateRevolution),
        endDate: this.#toNgayThangNam(info?.endDateRevolution),
        ...this.getNewDate(),
        name: profile.fullName || blank,
        address: profile.address || blank,
        ...this.getNewDate(),
      };
    });
  }

  exportLT1 = async (ids: number[]) => {
    try {
      const results = await this.loadLT1(ids);
      const templateUrl = this.#getTemplate('LT1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LT1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        position: x.info[0]?.position || blank,
        organ: x.info[0]?.organ || blank,
        retire: this.getDate(x.info[0]?.retire),
        dateJoinClan: this.getDate(x.info[0]?.dateJoinClan),
        date: this.getDate(x.info[0]?.date),
        startDate: this.getDate(x.info[0]?.startDateRevolution),
        endDate: this.getDate(x.info[0]?.endDateRevolution),
        ...this.getNewDate(),
        name: x.fullName || blank,
        address: x.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadLT2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet, mainBeneficiary } = profile;
      return {
        fileName: profile.fullName || 'LT2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullNameNcc: profile?.fullName || blank,
        dobNcc: this.#getDate(profile?.dateOfBirth),
        genderNcc: this.getGender(profile?.gender),
        nativePlaceNcc: profile?.nativePlace || blank,
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.#toNgayThangNam(info?.retire),
        dateJoinClan: this.#toNgayThangNam(info?.dateJoinClan),
        date: this.#toNgayThangNam(info?.date),
        startDateRevolution: this.#toNgayThangNam(info?.startDateRevolution),
        endDateRevolution: this.#toNgayThangNam(info?.endDateRevolution),
        death: this.#toDate(mainBeneficiary.dateOfNccDeath),
        fullName: mainBeneficiary?.fullName || blank,
        dob: this.#getDate(mainBeneficiary?.dateOfBirth) || blank,
        gender: this.getGender(mainBeneficiary?.gender) || blank,
        nativePlace: mainBeneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(mainBeneficiary),
        relation: mainBeneficiary?.relation || blank,
        ...this.getNewDate(),
        ward: mainBeneficiary.ward?.value || blank,
        address: mainBeneficiary?.address || blank,
        ...this.getNewDate(),
      };
    });
  }

  exportLT2 = async (ids: number[]) => {
    try {
      const results = await this.loadLT2(ids);
      const templateUrl = this.#getTemplate('LT2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LT2(data): Promise<any> {
    const profiles = [];
    const relative = data.map((x) => ({
      id: x.id,
      match:
        !!x.infoBeneficiary[0]?.relative && !!x.infoBeneficiary[0]?.status,
      beneficiary: x.infoBeneficiary[0],
      info: x.info[0]
    }));
    for (const x of data) {
      const obj = relative.find((y) => y.id === x.id);
      const info = obj.info;
      const beneficiary = obj.beneficiary;
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameNcc: x?.fullName || blank,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.getDate(info?.retire),
        dateJoinClan: this.getDate(info?.dateJoinClan),
        date: this.getDate(info?.date),
        startDateRevolution: this.getDate(info?.startDateRevolution),
        endDateRevolution: this.getDate(info?.endDateRevolution),
        death: beneficiary.dateOfNccDeath ? this.getDate(beneficiary.dateOfNccDeath) : blank,
        fullName: (obj.match && beneficiary?.fullName) || blank,
        dob: (obj.match && this.getDate(beneficiary?.dateOfBirth)) || blank,
        gender: (obj.match && this.getGender(beneficiary?.gender)) || blank,
        nativePlace: (obj.match && beneficiary?.nativePlace) || blank,
        permanent:
          obj.match && this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: (obj.match && beneficiary?.relation) || blank,
        ...this.getNewDate(),
        ward:
          (obj.match && beneficiary?.placeOfPermanent?.ward?.value) || blank,
        address:
          (obj.match && beneficiary?.placeOfPermanent?.address) || blank
      });
    }
    return profiles;
  }

  loadTKN1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet  } = profile;
      const [info] = [profile?.info[0]]
      return {
        fileName: profile.fullName || 'TKN1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.#toNgayThangNam(info.retire),
        dateJoinClan: this.#toNgayThangNam(info.dateJoinClan),
        date: this.#toNgayThangNam(info.date),
        takeOfficeDate: this.#getDate(info?.takeOfficeDate),
        roleRevolution: info?.roleRevolution || blank,
        note: info?.note || blank,
        ...this.getNewDate(),
        name: profile.fullName,
        address: profile.address || blank,
        ward: profile.ward?.value || blank,
      };
    });
  }

  exportTKN1 = async (ids: number[]) => {
    try {
      const results = await this.loadTKN1(ids);
      const templateUrl = this.#getTemplate('TKN1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TKN1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        position: x.info[0]?.position || blank,
        organ: x.info[0]?.organ || blank,
        retire: x.info[0]?.retire ? moment(x.info[0].retire)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        dateJoinClan: x.info[0]?.dateJoinClan ? moment(x.info[0].dateJoinClan)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        date: x.info[0]?.date ? moment(x.info[0].date)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        takeOfficeDate: x.info[0]?.takeOfficeDate ? moment(x.info[0].takeOfficeDate)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        roleRevolution: x.info[0]?.roleRevolution || blank,
        note: x.info[0]?.note || blank,
        ...this.getNewDate(),
        name: x.fullName,
        address: x.placeOfPermanent?.address || blank,
        ward: x.placeOfPermanent?.ward?.value || blank
      });
    }
    return profiles;
  }

  loadTKN2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet,mainBeneficiary } = profile;
      return {
        fileName: profile.fullName || 'TKN2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullNameNcc: profile?.fullName || blank,
        dobNcc: this.#getDate(profile?.dateOfBirth),
        genderNcc: this.getGender(profile?.gender),
        nativePlaceNcc: profile?.nativePlace || blank,
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.#toNgayThangNam(info?.retire),
        dateJoinClan: this.#toNgayThangNam(info?.dateJoinClan),
        date: this.#toNgayThangNam(info?.date),
        startDateRevolution: this.#toDate(info?.startDateRevolution) || blank,
        endDateRevolution: this.#toDate(info?.endDateRevolution) || blank,
        death: this.#toDate(mainBeneficiary?.dateOfNccDeath),
        fullName: mainBeneficiary?.fullName || blank,
        dob: this.#getDate(mainBeneficiary?.dateOfBirth) || blank,
        gender: this.getGender(mainBeneficiary?.gender) || blank,
        nativePlace: mainBeneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(mainBeneficiary),
        relation: mainBeneficiary?.relation || blank,
        ...this.getNewDate(),
        ward: mainBeneficiary.ward?.value || blank,
        address: mainBeneficiary?.address || blank,

      };
    });
  }

  exportTKN2 = async (ids: number[]) => {
    try {
      const results = await this.loadTKN2(ids);
      const templateUrl = this.#getTemplate('TKN2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TKN2(data): Promise<any> {
    const profiles = [];
    const relative = data.map((x) => ({
      id: x.id,
      match:
        !!x.infoBeneficiary[0]?.relative && !!x.infoBeneficiary[0]?.status,
      beneficiary: x.infoBeneficiary[0],
      info: x.info[0]
    }));
    for (const x of data) {
      const obj = relative.find((y) => y.id === x.id);
      const info = obj.info;
      const beneficiary = obj.beneficiary;
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameNcc: x?.fullName || blank,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        position: info?.position || blank,
        organ: info?.organ || blank,
        retire: this.getDate(info?.retire),
        dateJoinClan: this.getDate(info?.dateJoinClan),
        date: this.getDate(info?.date),
        startDateRevolution: this.getDate(info?.startDateRevolution),
        endDateRevolution: this.getDate(info?.endDateRevolution),
        death: this.getDate(beneficiary?.dateOfNccDeath),
        fullName: (obj.match && beneficiary?.fullName) || blank,
        dob: (obj.match && this.getDate(beneficiary?.dateOfBirth)) || blank,
        gender: (obj.match && this.getGender(beneficiary?.gender)) || blank,
        nativePlace: (obj.match && beneficiary?.nativePlace) || blank,
        permanent:
          obj.match && this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: (obj.match && beneficiary?.relation) || blank,
        ...this.getNewDate(),
        ward:
          (obj.match && beneficiary?.placeOfPermanent?.ward?.value) || blank,
        address:
          (obj.match && beneficiary?.placeOfPermanent?.address) || blank
      });
    }
    return profiles;
  }

  loadLS4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, aRelative } = profile;
      const [info, infoNcc, beneficiary] = [profile.info[0], profile.infoNcc[0], profile.mainBeneficiary];
      return {
        fileName: beneficiary.fullName || 'LS4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: beneficiary?.fullName || blank,
        dob: this.#getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary),
        relation: beneficiary?.relation || blank,
        fullNameLS: profile?.fullName || blank,
        death: infoNcc?.dead || blank,
        nativePlaceLS: profile?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.#toNgayThangNam(info?.decidedDate),
        aRelative,
        ...this.getNewDate(),
        ward: beneficiary?.ward?.value || blank,
        ...this.getNewDate()
      };
    });
  }

  exportLS4 = async (ids: number[]) => {
    try {
      const results = await this.loadLS4(ids);
      const templateUrl = this.#getTemplate('LS4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LS4(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const [info, beneficiary] = [x.info[0], x.infoBeneficiary[0]];
      const data = await this.benefRepository.find({
        where: { id: Not(In([beneficiary?.id])) }
      });
      const aRelative = data.map((x, y) => {
        return {
          stt: y + 1,
          dob: this.getDate(x?.dateOfBirth),
          ...x
        };
      });
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: beneficiary?.fullName || blank,
        dob: this.getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: beneficiary?.relation || blank,
        fullNameLS: x?.fullName || blank,
        death: beneficiary?.dateOfNccDeath || blank,
        nativePlaceLS: x?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.getDate(info?.decidedDate) || blank,
        aRelative,
        ...this.getNewDate(),
        ward: x.infoBeneficiary?.placeOfPermanent?.ward?.value || blank
      });
    }
    return profiles;
  }

  loadLS5 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferByMonth } = profile;
      const [info, beneficiary] = [profile.info[0], profile.mainBeneficiary]
      return {
        fileName: profile.fullName || 'LS5',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        fullNameLS: profile?.fullName || blank,
        code: profile.code,
        fullName: beneficiary?.fullName || blank,
        dob: this.#getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary),
        relation: beneficiary?.relation || blank,
        death: beneficiary?.dateOfNccDeath || blank,
        nativePlaceLS: profile?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedOnce: profile?.other.decidedOnce || blank,
        decidedDate: this.#toDate(info.decidedDate) || blank,
        decidedDateOnce: this.#toDate(profile.other.decidedDateOnce) || blank,
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth),
        totalPreferByMonthText: DocSo.doc(totalPreferByMonth),
        ...this.getNewDate(),
        ward: beneficiary?.ward?.value || blank,
        ...this.getNewDate()
      };
    });
  }

  exportLS5 = async (ids: number[]) => {
    const results = await this.loadLS5(ids);
    const templateUrl = this.#getTemplate('LS5');
    return await this.#export(templateUrl, results);
  }

  private async LS5(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const [info, beneficiary] = [x.info[0], x.infoBeneficiary[0]];
      const data = await this.benefRepository.find({
        where: { id: Not(In([beneficiary?.id])) }
      });
      const aRelative = data.map((x, y) => {
        return {
          stt: y + 1,
          dob: this.getDate(x?.dateOfBirth),
          ...x
        };
      });
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: beneficiary?.fullName || blank,
        dob: this.getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: beneficiary?.relation || blank,
        fullNameLS: x?.fullName || blank,
        death: beneficiary?.dateOfNccDeath || blank,
        nativePlaceLS: x?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.getDate(info?.decidedDate) || blank,
        aRelative,
        ...this.getNewDate(),
        ward: x.infoBeneficiary?.placeOfPermanent?.ward?.value || blank
      });
    }
    return profiles;
  }

  loadLS6 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, aRelative, totalPreferOnce } = profile;
      const [info, beneficiary] = [profile.info[0], profile.mainBeneficiary];
     
      return {
        fileName: beneficiary?.fullName || 'LS6',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: beneficiary?.fullName || blank,
        totalPreferOnce: this.#formatCurrency(totalPreferOnce),
        dob: this.#getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary),
        relation: beneficiary?.relation || blank,
        fullNameLS: profile?.fullName || blank,
        death: beneficiary?.dateOfNccDeath || blank,
        nativePlaceLS: profile?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        allowance: profile?.other?.allowance || blank,
        decidedDate: this.#toNgayThangNam(info?.decidedDate),
        decidedOther: profile?.other.decided || blank,
        aRelative,
        ...this.getNewDate(),
        ward: beneficiary?.ward?.value || blank,
        ...this.getNewDate()
      };
    });
  }

  exportLS6 = async (ids: number[]) => {
    try {
      const results = await this.loadLS6(ids);
      const templateUrl = this.#getTemplate('LS6');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LS6(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const [info, beneficiary] = [x.info[0], x.infoBeneficiary[0]];
      const data = await this.benefRepository.find({
        where: { id: Not(In([beneficiary?.id])) }
      });
      const aRelative = data.map((x, y) => {
        return {
          stt: y + 1,
          dob: this.getDate(x?.dateOfBirth),
          ...x
        };
      });
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: beneficiary?.fullName || blank,
        dob: this.getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: beneficiary?.relation || blank,
        fullNameLS: x?.fullName || blank,
        death: beneficiary?.dateOfNccDeath || blank,
        nativePlaceLS: x?.nativePlace || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.getDate(info?.decidedDate) || blank,
        aRelative,
        ...this.getNewDate(),
        ward: x.infoBeneficiary?.placeOfPermanent?.ward?.value || blank
      });
    }
    return profiles;
  }

  loadBM1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet } = profile;
      return {
        fileName: profile.fullName || 'BM1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decided: info?.decided,
        ...this.getNewDate(),
        ward: profile.ward?.value || blank,
        name: profile.fullName,
        address: profile.address || blank,
        ...this.getNewDate()
      };
    });
  }

  exportBM1 = async (ids: number[]) => {
    try {
      const results = await this.loadBM1(ids);
      const templateUrl = this.#getTemplate('BM1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async BM1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decided: x.info[0]?.decided,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x.fullName,
        address: x.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadBM2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet, mainBeneficiary} = profile;
      return {
        fileName: profile.fullName || 'BM2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullNameBM: profile.fullName || blank,
        dobBM: this.#getDate(profile.dateOfBirth),
        nativePlaceBM: profile?.nativePlace || blank,
        death: this.#toDate(mainBeneficiary?.dateOfNccDeath),
        decided: info?.decided || blank,
        fullName: mainBeneficiary?.fullName,
        gender: this.getGender(mainBeneficiary?.gender),
        dob: this.#getDate(mainBeneficiary?.dateOfBirth),
        nativePlace: mainBeneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(mainBeneficiary),
        relation: mainBeneficiary?.relation || blank,
        ...this.getNewDate(),
        ward: mainBeneficiary?.ward?.value || blank,
        name: mainBeneficiary?.fullName,
        address: mainBeneficiary?.address || blank,
      };
    });
  }

  exportBM2 = async (ids: number[]) => {
    try {
      const results = await this.loadBM2(ids);
      const templateUrl = this.#getTemplate('BM2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async BM2(data): Promise<any> {
    const profiles = [];
    const relative = data.map((x) => ({
      id: x.id,
      match:
        !!x.infoBeneficiary[0].relative && !!x.infoBeneficiary[0].status,
      beneficiary: x.infoBeneficiary[0],
      info: x.info[0]
    }));
    for (const x of data) {
      const obj = relative.find((y) => y.id === x.id);
      const info = obj.info;
      const beneficiary = obj.beneficiary;
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameBM: x.fullName || blank,
        dobBM: this.getDate(x.dateOfBirth),
        nativePlaceBM: x?.nativePlace || blank,
        death: this.getDate(beneficiary?.dateOfNccDeath),
        decided: info?.decided || blank,
        fullName: beneficiary?.fullName,
        gender: this.getGender(beneficiary?.gender),
        dob: this.getDate(beneficiary?.dateOfBirth),
        nativePlace: beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: beneficiary?.relation || blank,
        ...this.getNewDate(),
        ward: beneficiary?.placeOfPermanent?.ward?.value || blank,
        name: beneficiary?.fullName,
        address: beneficiary?.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadAH1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet } = profile;
      return {
        fileName: profile.fullName || 'AH1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        organ: info?.organManager || blank,
        degree: info?.decisionKind || blank,
        decided: info?.decided || blank,
        decidedDate: this.#toNgayThangNam(info?.decidedDate),
        ...this.getNewDate(),
        ward: profile.ward?.value || blank,
        name: profile?.fullName,
        address: profile?.address || blank,
        AH: profile?.fullName,
      };
    });
  }

  exportAH1 = async (ids: number[]) => {
    try {
      const results = await this.loadAH1(ids);
      const templateUrl = this.#getTemplate('AH1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async AH1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        organ: x.info[0]?.organManager || blank,
        degree: x.info[0]?.decisionKind || blank,
        decided: x.info[0]?.decided || blank,
        decidedDate: this.getDate(x.info[0]?.decidedDate),
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName,
        address: x?.placeOfPermanent?.address || blank,
        AH: x?.fullName
      });
    }
    return profiles;
  }

  loadAH2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info, beneficiary] = [profile.info[0], profile.mainBeneficiary];
      const { doet } = profile;
      return {
        fileName:  beneficiary.fullName || 'AH2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullNameNcc: profile?.fullName || blank,
        dobNcc: this.#getDate(profile?.dateOfBirth) || blank,
        genderNcc: this.getGender(profile?.gender) || blank,
        nativePlaceNcc: profile?.nativePlace || blank,
        death: this.#toDate( beneficiary?.dateOfNccDeath) || blank,
        degree: info?.decisionKind || blank,
        decided: info?.decided || blank,
        decidedDate: this.#toDate(info?.decidedDate) || blank,
        fullName:  beneficiary?.fullName || blank,
        dob: this.#getDate( beneficiary?.dateOfBirth) || blank,
        gender: this.getGender( beneficiary?.gender) || blank,
        nativePlace:  beneficiary?.nativePlace || blank,
        permanent: this.#getPermanent( beneficiary)|| blank,
        relation:  beneficiary?.relation || blank,
        ...this.getNewDate(),
        name:  beneficiary?.fullName || blank,
        ward: profile?.ward?.value || blank,
        address:  beneficiary?.address || blank
      };
    });
  }

  exportAH2 = async (ids: number[]) => {
    try {
      const results = await this.loadAH2(ids);
      const templateUrl = this.#getTemplate('AH2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async AH2(data): Promise<any> {
    const profiles = [];
    const relative = data.map((x) => ({
      id: x.id,
      match:
        !!x.infoBeneficiary[0]?.relative && !!x.infoBeneficiary[0]?.status,
      beneficiary: x.infoBeneficiary[0],
      info: x.info[0]
    }));
    for (const x of data) {
      const obj = relative.find((y) => y.id === x.id);
      const info = obj.info;
      const beneficiary = obj.beneficiary;
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameNcc: x?.fullName || blank,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        death: this.getDate(beneficiary?.dateOfNccDeath) || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.getDate(info?.decidedDate),
        fullName: (obj.match && beneficiary?.fullName) || blank,
        dob: (obj.match && this.getDate(beneficiary?.dateOfBirth)) || blank,
        gender: (obj.match && this.getGender(beneficiary?.gender)) || blank,
        nativePlace: (obj.match && beneficiary?.nativePlace) || blank,
        permanent:
          obj.match && this.#getPermanent(beneficiary?.placeOfPermanent),
        relation: (obj.match && beneficiary?.relation) || blank,
        ...this.getNewDate(),
        name: (obj.match && beneficiary?.fullName) || blank,
        ward:
          (obj.match && beneficiary?.placeOfPermanent?.ward?.value) || blank,
        address:
          (obj.match && beneficiary?.placeOfPermanent?.address) || blank
      });
    }
    return profiles;
  }

  loadHH1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
     return profiles.map(profile => {
      const [info, infoNcc] = [profile.info[0], profile.infoNcc[0]];
      const inprogress = (info?.inprogressRevolution || []).map((item, idx) => {
        return {
          ...item,
          stt: idx + 1,
          startDate: this.#toDate(item.startDate) || blank,
          endDate: this.#toDate(item.endDate) || blank,
          rank: (item.rank != undefined ? item.rank : "") || blank,
          organ: (item.organ != undefined ? item.organ : "") || blank,
          area: (item.area != undefined ? item.area : "") || blank,
        };
      });
      const children = (infoNcc?.disabilitiesChildren || []).map((item, idx) => {
        return {
          ...item,
          stt: idx + 1,
          fullNameC: item?.fullName || blank,
          dateOfBirth: this.getDate(item?.dateOfBirth) || blank,
          disability: item?.disability || blank,
        };
      });
      const { doet } = profile;
      return {
        fileName: profile.fullName || 'HH1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code || blank,
        fullName: profile?.fullName || blank,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        // inprogressFlag: inprogress.length !== 0,
        inprogress,
        // defaultI: inprogress.length === 0,
        note: infoNcc?.disabilityCondition || blank,
        // childrenFlag: children.length !== 0,
        children,
        defaultC: children.length === 0,
        ...this.getNewDate(),
        ward: profile?.ward?.value || blank,
        name: profile?.fullName,
        address: profile?.address || blank,
        numb: children.length > 0 ? children.length : 0
      };
    });
  }

  exportHH1 = async (ids: number[]) => {
    try {
      const results = await this.loadHH1(ids);
      const templateUrl = this.#getTemplate('HH1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HH1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const inprogress = (x.info[0]?.inprogressRevolution || []).map(
        (x, y) => {
          return {
            stt: y + 1,
            ...x,
            startDate: this.getDate(x?.startDate),
            endDate: this.getDate(x?.endDate)
          };
        }
      );

      const children = (x.infoNcc[0]?.disabilitiesChildren || []).map(
        (x, y) => {
          return {
            ...x,
            stt: y + 1,
            fullNameC: x?.fullName || blank,
            dateOfBirth: this.getDate(x?.dateOfBirth)
          };
        }
      );
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        inprogressFlag: inprogress.length !== 0,
        inprogress,
        defaultI: inprogress.length === 0,
        note: x.infoNcc[0]?.disabilityCondition || blank,
        childrenFlag: children.length !== 0,
        children,
        defaultC: children.length === 0,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName,
        address: x?.placeOfPermanent?.address || blank,
        numb: children.length > 0 ? children.length : 0
      });
    }
    return profiles;
  }

  loadTD1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet } = profile;
      const htc = profile?.infoNcc[0]?.htc;
      return {
        fileName: profile?.fullName || 'TD1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        organ: htc?.organ || blank,
        decided: htc?.decided|| blank,
        decidedDate: this.#toDate(htc?.decidedDate),
        allowance: htc?.subsidy || blank, // TODO check (OLD: htc?.allowance)
        ...this.getNewDate(),
        ward: profile?.ward?.value || blank,
        name: profile?.fullName,
        address: profile?.address || blank,
        ...this.getNewDate()
      };
    });
  }

  exportTD1 = async (ids: number[]) => {
    try {
      const results = await this.loadTD1(ids);
      const templateUrl = this.#getTemplate('TD1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TD1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const htc = x.infoNcc[0]?.htc;
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        organ: htc?.organ || blank,
        decided: htc?.decided || blank,
        decidedDate: this.getDate(htc?.decidedDate),
        allowance: htc?.allowance || blank,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName,
        address: x?.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadTD2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet } = profile;
      const inprogress = (profile?.info[0]?.inprogressRevolution || []).map((x, y) => {
        return {
          ...x,
          startDate: this.#toDate(x?.startDate),
          endDate: this.#toDate(x?.endDate),
          rank: x?.rank != undefined ? x?.rank : "",
          organ: x?.organ != undefined ? x?.organ : "",
          area: x?.area != undefined ? x?.area : ""
        };
      });
      const jailed = (profile?.info[0]?.inprogressJailed || []).map((x, y) => {
        return {
          ...x,
          stt: y + 1,
          startDate: this.#toDate(x?.startDate),
          endDate: this.#toDate(x?.endDate),
          prison: x?.prison != undefined ? x?.prison : "",
          organ: x?.organ != undefined ? x?.organ : ""
        };
      });
      return {
        fileName: profile?.fullName || 'TD2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        fullName: profile?.fullName || blank,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        defaultI: inprogress.length === 0,
        inprogressFlag: inprogress.length !== 0,
        inprogress,
        defaultJ: jailed.length === 0,
        jailedFlag: jailed.length !== 0,
        jailed,
        ...this.getNewDate(),
        ward: profile?.ward?.value || blank,
        name: profile?.fullName || blank,
        address: profile?.address || blank
      };
    });
  }

  exportTD2 = async (ids: number[]) => {
    try {
      const results = await this.loadTD2(ids);
      const templateUrl = this.#getTemplate('TD2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TD2(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const inprogress = (x.info[0]?.inprogressRevolution || []).map((x, y) => {
        return {
          ...x,
          startDate: this.getDate(x.startDate),
          endDate: this.getDate(x.endDate),
          rank: x.rank != undefined ? x.rank : "",
          organ: x.organ != undefined ? x.organ : "",
          area: x.area != undefined ? x.area : ""
        };
      });
      const jailed = (x.info[0]?.inprogressJailed || []).map((x, y) => {
        return {
          ...x,
          stt: y + 1,
          startDate: this.getDate(x.startDate),
          endDate: this.getDate(x.endDate),
          prison: x.prison != undefined ? x.prison : "",
          organ: x.organ != undefined ? x.organ : ""
        };
      });
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        defaultI: inprogress.length === 0,
        inprogressFlag: inprogress.length !== 0,
        inprogress,
        defaultJ: jailed.length === 0,
        jailedFlag: jailed.length !== 0,
        jailed,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName || blank,
        address: x?.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadTD3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet } = profile;
      const benef = profile?.mainBeneficiary;
      const inprogress = (profile?.info[0]?.inprogressRevolution || []).map((x, y) => {
        return {
          ...x,
          startDate: this.#toDate(x?.startDate),
          endDate: this.#toDate(x?.endDate),
          rank: x?.rank != undefined ? x?.rank : "",
          organ: x?.organ != undefined ? x?.organ : "",
          area: x?.area != undefined ? x?.area : ""
        };
      });
      const jailed = (profile?.info[0]?.inprogressJailed || []).map((x, y) => {
        return {
          ...x,
          stt: y + 1,
          startDate: this.#toDate(x?.startDate),
          endDate: this.#toDate(x?.endDate),
          prison: x?.prison != undefined ? x.prison : "",
          organ: x?.organ != undefined ? x.organ : ""
        };
      });
      return {
        fileName: profile?.fullName || 'TD3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        fullNameNcc: profile?.fullName || blank,
        dobNcc: this.#getDate(profile?.dateOfBirth),
        genderNcc: this.getGender(profile?.gender),
        nativePlaceNcc: profile?.nativePlace || blank,
        permanentNcc: this.#getPermanent(profile),
        defaultI: inprogress.length === 0,
        inprogressFlag: inprogress.length !== 0,
        inprogress,
        defaultJ: jailed.length === 0,
        jailedFlag: jailed.length !== 0,
        jailed,
        fullName: benef?.fullName || blank,
        gender: this.getGender(benef?.gender),
        dob: this.#getDate(benef?.dateOfBirth),
        nativePlace: benef?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        relation: benef?.relation || blank,
        ...this.getNewDate(),
        ward: benef?.ward?.value || blank,
        name: benef?.fullName || blank,
        address: profile?.address || blank
      };
    });
  }

  exportTD3 = async (ids: number[]) => {
    try {
      const results = await this.loadTD3(ids);
      const templateUrl = this.#getTemplate('TD3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TD3(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const inprogress = (x.info[0]?.inprogressRevolution || []).map((x, y) => {
        return {
          ...x,
          startDate: this.getDate(x.startDate),
          endDate: this.getDate(x.endDate),
          rank: x.rank != undefined ? x.rank : "",
          organ: x.organ != undefined ? x.organ : "",
          area: x.area != undefined ? x.area : ""
        };
      });
      const jailed = (x.info[0]?.inprogressJailed || []).map((x, y) => {
        return {
          ...x,
          stt: y + 1,
          startDate: this.getDate(x.startDate),
          endDate: this.getDate(x.endDate),
          prison: x.prison != undefined ? x.prison : "",
          organ: x.organ != undefined ? x.organ : ""
        };
      });
      const benef = x.infoBeneficiary[0];
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameNcc: x?.fullName || blank,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        permanentNcc: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        defaultI: inprogress.length === 0,
        inprogressFlag: inprogress.length !== 0,
        inprogress,
        defaultJ: jailed.length === 0,
        jailedFlag: jailed.length !== 0,
        jailed,
        fullName: benef?.fullName || blank,
        gender: this.getGender(benef?.gender),
        dob: this.getDate(benef?.dateOfBirth),
        nativePlace: benef?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        relation: benef?.relation || blank,
        ...this.getNewDate(),
        ward: benef.placeOfPermanent?.ward?.value || blank,
        name: benef?.fullName || blank,
        address: benef?.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadHS1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, aRelative, } = profile;
      const [info, infoNcc, benefic] = [profile.info[0], profile.infoNcc[0], profile.mainBeneficiary];
      
      return {
        fileName: profile.fullName || 'HS1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullNameNcc: profile?.fullName || blank,
        dobNcc: this.#getDate(profile?.dateOfBirth),
        join: this.#toDate(infoNcc?.enlistmentDate),
        genderNcc: this.getGender(profile?.gender),
        nativePlaceNcc: profile?.nativePlace || blank,
        permanentNcc: this.#getPermanent(profile),
        death: this.#getDate(infoNcc?.dead) || blank,
        degree: info?.degree || blank,
        decided: info?.decided || blank,
        decidedDate: this.#toNgayThangNam(info.decidedDate),
        default: aRelative.length === 0,
        relativeFlag: aRelative.length !== 0,
        aRelative,
        level: infoNcc?.level || blank,
        sacrificialUnit: infoNcc?.sacrificialUnit || blank,
        sacrificialPlace: infoNcc?.sacrificialPlace || blank,
        sacrificialCase: infoNcc?.sacrificialCase,
        object: info?.object || blank,
        burialGrave: info?.burialGrave || blank,
        deathCertificateNum: info?.deathCertificateNum || blank,
        of: info?.of,
        deathCertificateDate: this.#toNgayThangNam(info.deathCertificateDate) || blank,
        ...this.getNewDate(),
        fullName: benefic?.fullName || blank,
        gender: this.getGender(benefic?.gender),
        dob: this.#getDate(benefic?.dateOfBirth),
        relation: benefic?.relation || blank,
        nativePlace: benefic?.nativePlace || blank
      };
    });
  }

  exportHS1 = async (ids: number[]) => {
    try {
      const results = await this.loadHS1(ids);
      const templateUrl = this.#getTemplate('HS1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HS1(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const relatives =
        x?.infoBeneficiary
          .filter((value) => !value.status)
          .map((value, y) => {
            return {
              stt: y + 1,
              fullName: value?.fullName || blank,
              dob: this.getDate(value?.dateOfBirth),
              relation: value?.relation || blank,
              address: value?.placeOfPermanent?.address || blank
            };
          }) || [];
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullNameNcc: x?.fullName || blank,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        permanentNcc: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        death: this.getDate(x?.infoNcc[0]?.dead),
        degree: x.info[0]?.degree || blank,
        decided: x.info[0]?.decided || blank,
        decidedDate: moment(x.info[0].decidedDate)
          .add(1, "day")
          .format("DD/MM/YYYY"),
        default: relatives.length === 0,
        relativeFlag: relatives.length !== 0,
        relatives,
        level: x.infoNcc["0"]?.level,
        sacrificialUnit: x.infoNcc["0"]?.sacrificialUnit,
        sacrificialPlace: x.infoNcc["0"]?.sacrificialPlace,
        sacrificialCase: x.infoNcc["0"]?.sacrificialCase,
        object: x.info["0"]?.object,
        burialGrave: x.info["0"]?.burialGrave,
        deathCertificateNum: x.info["0"]?.deathCertificateNum,
        of: x.info["0"]?.of,
        deathCertificateDate: moment(x.infoNcc[0].deathCertificateDate)
          .add(1, "day")
          .format("[ngày] DD [tháng] MM [năm] YYYY"),
        ...this.getNewDate(),
        fullName: x.infoBeneficiary[0]?.fullName || blank,
        gender: this.getGender(x.infoBeneficiary[0]?.gender),
        dob: this.getDate(x.infoBeneficiary[0]?.dateOfBirth),
        relation: x.infoBeneficiary[0]?.relation || blank,
        nativePlace: x.infoBeneficiary[0]?.nativePlace || blank
      });
    }
    return profiles;
  }

  loadHS2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferByMonth, totalPreferOnce } = profile;
      const [info, infoNcc] = [profile.info[0], profile.infoNcc[0]];
      const allowance = (profile?.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);
      const decidedS = profile?.prefers.filter((value) => value.subsidyForm === 1)
              .map((value, y) => {
                          return {
                              ...value,
                              stt: y+1
                           };
                        })      
      const decidedOnce = profile?.prefers.filter((value) => value.subsidyForm === 0)
              .map((value, y) => {
                      return {      
                        ...value,
                        stt: y+1
                      };
                      })         
      
      return {
        fileName: profile.fullName || 'HS2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        address: profile?.address || blank,
        injuredDate: this.#toDate(info?.injuredDate),
        injured: info?.injured || blank,
        verifyDate: this.#toDate(info?.verifyDate),
        join: this.#toNgayThangNam(infoNcc?.enlistmentDate),
        unit: infoNcc?.unit || blank,
        rank: infoNcc?.rank,
        injuredPlace: infoNcc?.injuredPlace,
        injuredCase: infoNcc?.injuredCase,
        injuredCondition: infoNcc?.injuredCondition,
        inspectionNum: info.inspectionNum,
        inspectionDate: this.#toNgayThangNam(info.inspectionDate),
        inspectionBoard: info.inspectionBoard,
        startDate: this.#toNgayThangNam(profile.other.startDate),
        prefersName: profile?.prefers?.pop()?.name,
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth) || blank,
        totalPerferOnce: this.#formatCurrency(totalPreferOnce) || blank,
        allowance: this.#formatCurrency(allowance) || blank,
        decided: profile.other.decided || blank,
        decidedDate: this.#toNgayThangNam(profile.other.decidedDate) || blank,
        decidedR: profile.other.decidedOnce || blank,
        decidedDateOnce: this.#toNgayThangNam(profile.other.decidedDateOnce) || blank,
        subsidyForms: decidedS.length !== 0,
        subsidyForm1: decidedOnce.length !== 0,
        ...this.getNewDate()
      };
    });
  }

  exportHS2 = async (ids: number[]) => {
    try {
      const results = await this.loadHS2(ids);
      const templateUrl = this.#getTemplate('HS2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HS2(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        address: x?.placeOfPermanent?.address || blank,
        injuredDate: this.getDate(x?.info[0]?.injuredDate),
        injured: x?.info[0]?.injured || blank,
        verifyDate: this.getDate(x?.info[0]?.verifyDate),
        join: moment(x.infoNcc[0].enlistmentDate)
          .add(1, "day")
          .format("[ngày] DD [tháng] MM [năm] YYYY"),
        unit: x.infoNcc[0].unit || ".......................................",
        rank: x.infoNcc[0].rank,
        injuredPlace: x.infoNcc[0].injuredPlace,
        injuredCase: x.infoNcc[0].injuredCase,
        injuredCondition: x.infoNcc[0].injuredCondition,
        inspectionNum: x.info[0].inspectionNum,
        inspectionDate: moment(x.info[0].inspectionDate).format("[ngày] DD [tháng] MM [năm] YYYY"),
        inspectionBoard: x.info[0].inspectionBoard,
        decided: x.other.decided || "",
        decidedDateOnce: moment(x.other.decidedDateOnce).format("[ngày] DD [tháng] MM [năm] YYYY"),
        startDate: moment(x.other.startDate).format("[ngày] DD [tháng] MM [năm] YYYY"),
        prefersName: x.prefers?.pop()?.name,
        prefersMoney: this.getVND(x.prefers?.pop()?.subsidy),
        ...this.getNewDate()
      });
    }
    return profiles;
  }

  loadHS3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferByMonth } = profile;
      const [info, infoNcc, prefer] = [profile.info[0], profile.infoNcc[0], profile.prefers[0]];
      const allowance = (profile.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);
      return {
        fileName: profile.fullName || 'HS3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName || blank,
        dob: this.#getDate(profile?.dateOfBirth),
        enlistmentDate: this.#toDate(infoNcc.enlistmentDate),
        enlistmentUnit: infoNcc.enlistmentUnit || blank,
        demobilizationTime: this.#getDate(infoNcc.demobilizationTime),
        demobilizationUnit: infoNcc.demobilizationUnit || blank,
        CATime1: infoNcc.CATime1,
        CATime2: infoNcc.CATime2,
        CTTime1: infoNcc.CTTime1,
        CTTime2: infoNcc.CTTime2,
        KKTime1: infoNcc.KKTime1,
        KKTime2: infoNcc.KKTime2,
        medicalAssessmentNum: info?.medicalAssessmentNum,
        medicalAssessmentDate: this.#toNgayThangNam(info?.medicalAssessmentDate),
        of: info?.of,
        medicalCondition: info.medicalCondition ?? "...",
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        demobilizationRank: infoNcc?.demobilizationRank ?? "...",
        injuredDate: this.#toDate(info?.verifyDate),
        injured: info?.injured || blank,
        prefers: prefer?.name || blank,
        decided: profile?.other?.decided || "...",
        decidedDate: this.#toDate(profile?.other?.decidedDate) || blank,
        verifyDate: this.#toDate(info?.verifyDate),
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth),
        totalPreferByMonthText: DocSo.doc(totalPreferByMonth), 
        allowance: this.#formatCurrency(allowance) || blank,
        sum: this.#formatCurrency(totalPreferByMonth + allowance),
        ...this.getNewDate()
        
      };
    });
  }

  exportHS3 = async (ids: number[]) => {
    try {
      const results = await this.loadHS3(ids);
      const templateUrl = this.#getTemplate('HS3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HS3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const enlistmentDate = this.getNewDate(x?.infoNcc[0].enlistmentDate);
      const demobilizationTime = this.getNewDate(x?.infoNcc[0].demobilizationTime);
      const CATime = this.getNewDate(x?.infoNcc[0].CATime);
      const CTTime = this.getNewDate(x?.infoNcc[0].CTTime);
      const KKTime = this.getNewDate(x?.infoNcc[0].KKTime);
      const decidedDate = this.getNewDate(x?.other?.decidedDate);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        enlistmentDated: x?.infoNcc[0].enlistmentDate ? enlistmentDate.d : "...",
        enlistmentDatem: x?.infoNcc[0].enlistmentDate ? enlistmentDate.m : "...",
        enlistmentDatey: x?.infoNcc[0].enlistmentDate ? enlistmentDate.y : "...",
        enlistmentUnit: x?.infoNcc[0].enlistmentUnit ?? "",
        demobilizationTimed: x?.infoNcc[0].demobilizationTime ? demobilizationTime.d : "...",
        demobilizationTimem: x?.infoNcc[0].demobilizationTime ? demobilizationTime.m : "...",
        demobilizationTimey: x?.infoNcc[0].demobilizationTime ? demobilizationTime.y : "...",
        CATimed: x?.infoNcc[0].CATime ? CATime.d : "...",
        CATimem: x?.infoNcc[0].CATime ? CATime.m : "...",
        CATimey: x?.infoNcc[0].CATime ? CATime.y : "...",
        CTTimed: x?.infoNcc[0].CTTime ? CTTime.y : "...",
        CTTimem: x?.infoNcc[0].CTTime ? CTTime.m : "...",
        CTTimey: x?.infoNcc[0].CTTime ? CTTime.d : "...",
        KKTimed: x?.infoNcc[0].KKTime ? KKTime.d : "...",
        KKTimem: x?.infoNcc[0].KKTime ? KKTime.m : "...",
        KKTimey: x?.infoNcc[0].KKTime ? KKTime.y : "...",
        demobilizationUnit: x?.infoNcc[0].demobilizationUnit ?? "..",
        medicalCondition: x?.info[0].medicalCondition ?? "...",
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        demobilizationRank: x?.info[0]?.demobilizationRank ?? "...",
        injuredDate: this.getDate(x?.info[0]?.injuredDate),
        injured: x?.info[0]?.injured || blank,
        prefers: x?.prefers[0]?.name || blank,
        decided: x?.other?.decided || "...",
        decidedDated: x?.other?.decidedDate ? decidedDate.d : "...",
        decidedDatem: x?.other?.decidedDate ? decidedDate.m : "...",
        decidedDatey: x?.other?.decidedDate ? decidedDate.y : "...",
        verifyDate: this.getDate(x?.info[0]?.verifyDate),
        subsidy: this.getVND(x?.prefers[0]?.subsidy),
        ...this.getNewDate()
      });
    }
    return profiles;
  }

  loadKC1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
   
    return profiles.map(profile => {
      const [info] = [profile?.info[0]];
      const { doet } = profile;
      return {
        fileName: profile.fullName || 'KC1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decided: info?.decided || blank,
        decidedDate: this.#toDate(info?.decidedDate),
        reward: this.getReward(info?.reward),
        startDateRevolution: this.#toDate(info?.startDateRevolution),
        endDateRevolution: this.#toDate(info?.endDateRevolution),
        months: 1,
        years: 2,
        ...this.getNewDate(),
        ward: profile?.ward?.value || blank,
        name: profile?.fullName,
        address: profile.address || blank,
        ...this.getNewDate()
      };
    });
  }

  exportKC1 = async (ids: number[]) => {
    try {
      const results = await this.loadKC1(ids);
      const templateUrl = this.#getTemplate('KC1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async KC1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decided: x.info[0]?.decided || blank,
        decidedDate: this.getDate(x.info[0]?.decidedDate),
        reward: this.getReward(x?.info[0]?.reward),
        startDateRevolution: this.getDate(x?.info[0].startDateRevolution),
        endDateRevolution: this.getDate(x?.info[0].endDateRevolution),
        months: 1,
        years: 2,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName,
        address: x.address || blank
      });
    }
    return profiles;
  }

  loadCC1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet } = profile;
      return {
        fileName: profile.fullName || 'CC1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        reward: this.getReward(info?.reward),
        decided: info?.decided || blank,
        decidedDate: this.#toDate(info?.decidedDate),
        note: info?.note || blank,
        ...this.getNewDate(),
        ward: profile?.ward?.value || blank,
        name: profile?.fullName,
        address: profile?.address || blank,
        ...this.getNewDate()
      };
    });
  }

  exportCC1 = async (ids: number[]) => {
    try {
      const results = await this.loadCC1(ids);
      const templateUrl = this.#getTemplate('CC1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async CC1(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        reward: this.getReward(x?.info[0]?.reward),
        decided: x.info[0]?.decided || blank,
        decidedDate: x.info[0]?.decidedDate ? moment(x.info[0]?.decidedDate)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        note: x.info[0]?.note || blank,
        ...this.getNewDate(),
        ward: x.placeOfPermanent?.ward?.value || blank,
        name: x?.fullName,
        address: x?.placeOfPermanent?.address || blank
      });
    }
    return profiles;
  }

  loadLT4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const allowance = (profile.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const allowancePursuit = this.#parseFloat(profile?.other?.allowance)
      const newspaper = this.#parseFloat(profile?.other?.newspaperMoney)
      const { doet, totalPreferByMonth } = profile;
      return {
        fileName: profile.fullName || 'LT4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        startDateRevolution: this.#toDate(profile?.info[0]?.startDateRevolution),
        decidedDate: this.#toDate(profile?.other.decidedDate),
        money: this.#formatCurrency(totalPreferByMonth),
        allowance: this.#formatCurrency(allowance) || blank,
        allowanceText: DocSo.doc(allowancePursuit) || blank,
        allowancePursuit: profile?.other.allowance || blank,
        newspaper: profile.other?.newspaperMoney || blank,
        sum: this.#formatCurrency(totalPreferByMonth + allowance + newspaper + allowancePursuit),
        sumText: DocSo.doc(totalPreferByMonth + allowance + newspaper + allowancePursuit),
        ...this.getNewDate()
      };
    });
  }

  exportLT4 = async (ids: number[]) => {
    try {
      const results = await this.loadLT4(ids);
      const templateUrl = this.#getTemplate('LT4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LT4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const allowance = (x.other && x.other.allowance ? +x.other.allowance : 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        startDateRevolution: this.getDate(x?.info[0]?.startDateRevolution),
        decidedDate: x.other?.decidedDate ? moment(x.other?.decidedDate)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        money: this.getVND(subsidy),
        allowance: this.getVND(allowance),
        allowanceText: DocSo.doc(allowance),
        newspaper: this.getVND(x.other?.newspaperMoney),
        sum: this.getVND(subsidy + allowance),
        sumText: DocSo.doc(subsidy + allowance),
        ...this.getNewDate()
      });
    }
    return profiles;
  }

  loadLT5 = async (ids: number[]) => { 
    const profiles = await this.#loadProfiles(ids);
   
    return profiles.map(profile => {
      const { doet ,totalPreferOnce} = profile;
      return {
        fileName: profile.fullName || 'LT5',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decidedOnce || blank,
        fullName: profile.mainBeneficiary?.fullName,
        fullNameNcc: profile?.fullName,
        dob: this.#getDate(profile.mainBeneficiary?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile.mainBeneficiary?.nativePlace || blank,
        relation: profile.mainBeneficiary?.relation || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.getDate(profile.other?.decidedDate),
        totalPreferOnce: this.#formatCurrency(totalPreferOnce),
        totalPreferOnceText: DocSo.doc(totalPreferOnce),
        death: this.#toDate(profile.mainBeneficiary.dateOfNccDeath),
        ...this.getNewDate()
      };
    });
  }

  exportLT5 = async (ids: number[]) => {
    try {
      const results = await this.loadLT5(ids);
      const templateUrl = this.#getTemplate('LT5');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async LT5(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const benef: any = Object.values(x.infoBeneficiary).find((x: any) => !!x.status);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: benef?.fullName,
        fullNameNcc: x?.fullName,
        dob: x?.dateOfBirth,
        gender: this.getGender(x?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: benef?.relation || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        death: this.getDate(x.info[0]?.dateOfNccDeath),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadTKN4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const newspaper = this.#parseFloat(profile?.other?.newspaperMoney);
      const allowance = (profile.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const allowancePursuit = this.#parseFloat(profile?.other?.allowance)
      const { doet , totalPreferByMonth} = profile;
      return {
        fileName: profile.fullName || 'TKN4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decided || blank,
        fullName: profile?.fullName || blank,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        startDateRevolution: this.#toDate(profile?.info[0]?.startDateRevolution),
        decidedDate: this.#toDate(profile.other?.decidedDate),
        money: this.#formatCurrency(totalPreferByMonth),
        allowance: profile.other.allowance || blank,
        allowanceText: DocSo.doc(allowancePursuit),
        newspaper: profile.other.newspaperMoney || blank,
        sum: this.#formatCurrency(totalPreferByMonth + allowance +  newspaper + allowancePursuit),
        sumText: DocSo.doc(totalPreferByMonth + allowancePursuit + newspaper + allowance),
        ...this.getNewDate()
      };
    });
  }

  exportTKN4 = async (ids: number[]) => {
    try {
      const results = await this.loadTKN4(ids);
      const templateUrl = this.#getTemplate('TKN4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TKN4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);

      const doet = await this.getUnit(x.doet_id);
      const newspaper = x.other && x.other.newspaperMoney ? +x.other.newspaperMoney.replace(/,/g, "") : 0;
      const allowance = x.other && x.other.allowance ? +x.other.allowance.replace(/,/g, "") : 0;
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        startDateRevolution: x.info[0]?.date ? moment(x.info[0].date)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        allowance: this.getVND(allowance),
        allowanceText: DocSo.doc(allowance),
        newspaper: this.getVND(newspaper),
        sum: this.getVND(subsidy + allowance + newspaper),
        sumText: DocSo.doc(subsidy + allowance + newspaper),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadTKN5 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferOnce } = profile;
      return {
        fileName: profile.fullName || 'TKN5',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decidedOnce || blank,
        fullName: profile.mainBeneficiary?.fullName || blank,
        fullNameNcc: profile?.fullName || blank,
        dob: this.#getDate(profile.mainBeneficiary?.dateOfBirth),
        gender: this.getGender(profile.mainBeneficiary?.gender),
        nativePlace: profile.mainBeneficiary?.nativePlace || blank,
        relation: profile.mainBeneficiary?.relation || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile.other?.decidedDate),
        money: this.#formatCurrency(totalPreferOnce),
        death: this.#toDate(profile.mainBeneficiary.dateOfNccDeath) || blank,
        sumText: DocSo.doc(totalPreferOnce),
        ...this.getNewDate()
      };
    });
  }

  exportTKN5 = async (ids: number[]) => {
    try {
      const results = await this.loadTKN5(ids);
      const templateUrl = this.#getTemplate('TKN5');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TKN5(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const benef: any = Object.values(x.infoBeneficiary).find((x: any) => !!x.status);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: benef?.fullName || blank,
        fullNameNcc: x?.fullName || blank,
        dob: this.getDate(benef?.dateOfBirth),
        gender: this.getGender(benef?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: benef?.relation || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        death: this.getDate(x.info[0]?.dateOfNccDeath),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadBM3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile?.info[0]]
      const allowance = (profile.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);
      const allowancePursuit = this.#parseFloat(profile?.other?.allowance)
      const { doet, totalPreferByMonth } = profile;
      return {
        fileName: profile.fullName || 'BM3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.other.decided,
        decided: info?.decided,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedOtherDate: this.#toDate(profile.other.decidedDate),
        decidedDate:this.#toDate(info?.decidedDate),
        money: this.#formatCurrency(totalPreferByMonth),
        allowance: this.#formatCurrency(allowance) || blank,
        allowancePursuit: profile.other.allowance || blank,
        allowanceText: DocSo.doc(allowancePursuit),
        sum: this.#formatCurrency(totalPreferByMonth + allowance + allowancePursuit),
        sumText: DocSo.doc(totalPreferByMonth + allowance + allowancePursuit),
        ...this.getNewDate()
      };
    });
  }

  exportBM3 = async (ids: number[]) => {
    try {
      const results = await this.loadBM3(ids);
      const templateUrl = this.#getTemplate('BM3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async BM3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);

      const allowance = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        allowance: this.getVND(allowance) || blank,
        sum: this.getVND(subsidy + allowance),
        sumText: DocSo.doc(subsidy + allowance),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadBM4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet, totalPreferOnce } = profile;
      return {
        fileName: profile.fullName || 'BM4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decidedOne: profile.other?.decidedOnce || blank,
        decided: profile.info[0]?.decided,
        fullName: profile.mainBeneficiary?.fullName,
        fullNameNcc: profile?.fullName,
        decidedDate: this.#toNgayThangNam(info?.decidedDate) || blank,
        dob: this.#getDate(profile.mainBeneficiary?.dateOfBirth),
        gender: this.getGender(profile.mainBeneficiary?.gender),
        nativePlace: profile.mainBeneficiary?.nativePlace || blank,
        relation: profile.mainBeneficiary?.relation || blank,
        permanent: this.#getPermanent(profile),
        money: this.#formatCurrency(totalPreferOnce),
        sumText: DocSo.doc(totalPreferOnce),
        ...this.getNewDate()
      };
    });
  }

  exportBM4 = async (ids: number[]) => {
    try {
      const results = await this.loadBM4(ids);
      const templateUrl = this.#getTemplate('BM4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async BM4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const benef: any = Object.values(x.infoBeneficiary).find((x: any) => !!x.status);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: benef?.fullName,
        fullNameNcc: x?.fullName,
        dob: this.getDate(benef?.dateOfBirth),
        gender: this.getGender(benef?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: benef?.relation || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        money: this.getVND(subsidy),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadAH3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferByMonth } = profile;
      const [info] = [profile?.info[0]]
      return {
        fileName: profile.fullName || 'AH3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.other.decided || blank,
        codeHs: profile?.code || blank,
        decided: info?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile.other.startDate) || blank,
        decidedInfoDate: this.#toDate(info?.decidedDate),
        degree: "",
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth) || blank,
        totalPreferByMonthText: DocSo.doc(totalPreferByMonth) || blank, 
        ...this.getNewDate()
      };
    });
  }

  exportAH3 = async (ids: number[]) => {
    try {
      const results = await this.loadAH3(ids);
      const templateUrl = this.#getTemplate('AH3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async AH3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: x.other.startDate ? moment(x.other.startDate)
          .add(1, "day")
          .format("DD/MM/YYYY") : "",
        money: this.getVND(subsidy),
        degree: "",
        // allowance: this.getVND(allowance) || blank,
        // sum: this.getVND(subsidy),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadAH4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info, beneficiary] = [profile.info[0], profile.mainBeneficiary];
      const { doet, totalPreferOnce,  } = profile;
      return {
        fileName: beneficiary.fullName || 'AH4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decidedOnce || blank,
        decidedInfo: info?.decided || blank,
        fullName: beneficiary?.fullName || blank,
        fullNameNcc: profile?.fullName,
        dob: this.#getDate(beneficiary?.dateOfBirth),
        gender: this.getGender(beneficiary?.gender),
        nativePlace: beneficiary?.nativePlace || blank,
        relation: beneficiary?.relation || blank,
        permanent: this.#getPermanent(beneficiary),
        decidedDate: this.#toDate(info?.decidedDate),
        totalPreferOnce: this.#formatCurrency(totalPreferOnce),
        death: this.#toDate(beneficiary?.dateOfNccDeath),
        totalPreferOnceText: DocSo.doc(totalPreferOnce),
        degree: info?.decisionKind,
        ...this.getNewDate()
      };
    });
  }

  exportAH4 = async (ids: number[]) => {
    try {
      const results = await this.loadAH4(ids);
      const templateUrl = this.#getTemplate('AH4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async AH4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const benef: any = Object.values(x.infoBeneficiary).find((x: any) => !!x.status);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: benef?.fullName,
        fullNameNcc: x?.fullName,
        dob: this.getDate(benef?.dateOfBirth),
        gender: this.getGender(benef?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: benef?.relation || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        death: this.getDate(x.infoBeneficiary[0]?.dateOfNccDeath),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadHH4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile?.info[0]]
      const allowance = (profile?.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);
      const allowancePursuit = this.#parseFloat(profile?.other?.allowance)
      const { doet , totalPreferByMonth} = profile;
      return {
        fileName: profile.fullName || 'HH4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        decided: profile?.other?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile.other?.decidedDate),
        certificationNum: info?.certificationNum,
        certificationDate: this.#toNgayThangNam(info?.certificationDate),
        of: info.of,
        ofCDHH: info.ofCDHH,
        medicalAssessmentNum: info?.medicalAssessmentNum || blank,
        medicalAssessmentDate: this.#toNgayThangNam(info?.medicalAssessmentDate),
        money: this.#formatCurrency(totalPreferByMonth),
        allowance: this.#formatCurrency(allowance) || blank,
        sum: this.#formatCurrency(totalPreferByMonth + allowance + allowancePursuit),
        sumText: DocSo.doc(totalPreferByMonth + allowance),
        grant: profile?.other?.allowance || blank,
        grantText: DocSo.doc(allowancePursuit),
        ...this.getNewDate()
      };
    });
  }

  exportHH4 = async (ids: number[]) => {
    try {
      const results = await this.loadHH4(ids);
      const templateUrl = this.#getTemplate('HH4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HH4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);

      const allowance = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        allowance: this.getVND(allowance),
        sum: this.getVND(subsidy + allowance),
        sumText: DocSo.doc(subsidy + allowance),
        grant: this.getVND(x.other?.allowance),
        grantText: DocSo.doc(x.other?.allowance),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadTD4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile?.info[0]]
      const { doet, totalPreferByMonth } = profile;
      return {
        fileName: profile?.fullName || 'TD4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: info.code,
        decided: profile?.other?.decided,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile?.other?.startDate),
        money: this.#formatCurrency(totalPreferByMonth),
        sumText: DocSo.doc(totalPreferByMonth),
        ...this.getNewDate()
      };
    });
  }

  exportTD4 = async (ids: number[]) => {
    try {
      const results = await this.loadTD4(ids);
      const templateUrl = this.#getTemplate('TD4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TD4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        decided: x.code,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.startDate),
        money: this.getVND(subsidy),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadTD5 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const benef = profile?.infoBeneficiary?.find?.(val => !!val.status)
      const [ beneficiary] = [ profile?.mainBeneficiary];
      const { doet, totalPreferOnce } = profile;
      return {
        fileName: profile?.fullName || 'TD5',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        decided: profile?.other?.decidedOnce || blank,
        fullName: benef?.fullName,
        fullNameNcc: profile?.fullName,
        nativePlaceNcc: profile?.nativePlace || blank,
        dob: this.#getDate(benef?.dateOfBirth),
        gender: this.getGender(benef?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: beneficiary?.relation || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile?.other?.decidedDate),
        totalPreferOnce: this.#formatCurrency(totalPreferOnce),
        totalPreferOnceText: DocSo.doc(totalPreferOnce),
        death: this.#toDate(beneficiary?.dateOfNccDeath),
        ...this.getNewDate()
      };
    });
  }

  exportTD5 = async (ids: number[]) => {
    try {
      const results = await this.loadTD5(ids);
      const templateUrl = this.#getTemplate('TD5');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TD5(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const benef: any = Object.values(x.infoBeneficiary).find((x: any) => !!x.status);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: benef?.fullName,
        fullNameNcc: x?.fullName,
        nativePlaceNcc: x?.nativePlace || blank,
        dob: this.getDate(benef?.dateOfBirth),
        gender: this.getGender(benef?.gender),
        nativePlace: benef?.nativePlace || blank,
        relation: x.infoBeneficiary[0]?.relation || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        death: this.getDate(x.infoBeneficiary[0]?.dateOfNccDeath),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadKC2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [profile.info[0]]
      const { doet, totalPreferOnce } = profile;
      return {
        fileName: profile.fullName || 'KC2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other.decidedOnce,
        decidedR: info?.decided || blank,
        decidedRDate: this.#toNgayThangNam(info?.decidedDate),
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        reward: this.getReward(info?.reward) || blank,
        money: this.#formatCurrency(totalPreferOnce),
        // allowance: this.getVND(allowance) || blank,
        // sum: this.getVND(money),
        sumText: DocSo.doc(totalPreferOnce),
        ...this.getNewDate(profile.other?.decidedDate)
      };
    });
  }

  exportKC2 = async (ids: number[]) => {
    try {
      const results = await this.loadKC2(ids);
      const templateUrl = this.#getTemplate('KC2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async KC2(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        reward: this.getReward(x.info?.reward),
        decidedR: x.info?.decided || blank,
        decidedRDate: this.getDate(x.info?.decidedDate),
        money: this.getVND(subsidy),
        // allowance: this.getVND(allowance) || blank,
        // sum: this.getVND(subsidy),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadCC2 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info] = [ profile.info[0]]
      const { doet, totalPreferByMonth } = profile;
      return {
        fileName: profile.fullName || 'CC2',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile?.other.startDate),
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth),
        totalPreferByMonthText: DocSo.doc(totalPreferByMonth),
        reward: this.getReward(info?.reward),
        decidedR: info?.decided || blank,
        decidedRDate: this.#toNgayThangNam(info?.decidedDate),
        // allowance: this.getVND(allowance) || blank,
        sum: this.#formatCurrency(totalPreferByMonth),
        ...this.getNewDate()
      };
    });
  }

  exportCC2 = async (ids: number[]) => {
    try {
      const results = await this.loadCC2(ids);
      const templateUrl = this.#getTemplate('CC2');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async CC2(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const doet = await this.getUnit(x.doet_id);
      const prefers = x.prefers.filter(function (prefer) {
        return +prefer.subsidyForm === 1;
      });
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(+prefers[0].subsidy),
        reward: this.getReward(x.info[0]?.reward),
        decidedR: x.other?.decided || blank,
        decidedRDate: x.other?.decidedDate ? moment(x.other.decidedDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        // allowance: this.getVND(allowance) || blank,
        // sum: this.getVND(subsidy),
        sumText: DocSo.doc(+prefers[0].subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }

  loadCC3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet,totalPreferOnce } = profile;
      const [info] = [profile.info[0]]
      return {
        fileName: profile.fullName || 'CC3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decidedOnce || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile.other?.decidedDate),
        money: this.#formatCurrency(totalPreferOnce),
        reward: this.getReward(info?.reward),
        decidedR: info?.decided || blank,
        decidedRDate: this.#toDate(info?.decidedDate),
        sumText: DocSo.doc(totalPreferOnce),
        ...this.getNewDate()
      };
    });
  }

  exportCC3 = async (ids: number[]) => {
    try {
      const results = await this.loadCC3(ids);
      const templateUrl = this.#getTemplate('CC3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async CC3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        reward: this.getReward(x.info?.reward),
        decidedR: x.info[0]?.decided || blank,
        decidedRDate: x.info[0]?.decidedDate ? moment(x.info?.decidedDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDateOnce)
      });
    }
    return profiles;
  }

  loadBB3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const { doet, totalPreferByMonth } = profile;
      const [info, infoNcc] = [profile.info[0], profile.infoNcc[0]];
      
      const allowance = (profile?.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);

      return {
        fileName: profile.fullName || 'BB3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile?.code,
        of: info?.of || blank,
        decided: profile?.other?.decided || blank,
        injured: info?.injured || blank,
        fullName: profile?.fullName || blank,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.getDate(profile?.other?.decidedDate),
        rank: infoNcc.demobilizationRank || info?.rank || blank,
        role: info?.roleRevolution || blank,
        money: this.#formatCurrency(totalPreferByMonth),
        reward: this.getReward(info?.reward),
        decidedOther: this.#toNgayThangNam(profile.other?.decidedDate),
        allowance: this.#formatCurrency(allowance) || blank,
        sum: this.#formatCurrency(totalPreferByMonth + allowance),
        grant:  blank,
        grantText: blank,
        sumText: DocSo.doc(totalPreferByMonth + allowance),
        join: this.#toDate(infoNcc?.enlistmentDate),
        CATime2: infoNcc.CATime2 || 0,
        CATime1: infoNcc.CATime1 || 0,
        KKTime1: infoNcc.KKTime1 || 0,
        KKTime2: infoNcc.KKTime2 || 0,
        medicalAssessmentDate: this.#toNgayThangNam(info?.medicalAssessmentDate),
        medicalAssessmentNum: info.medicalAssessmentNum,
        enlistmentUnit: infoNcc.enlistmentUnit,
        prefers: profile.prefers?.pop()?.name,
        ...this.getNewDate()
      };
    });
  }

  exportBB3 = async (ids: number[]) => {
    try {
      const results = await this.loadBB3(ids);
      const templateUrl = this.#getTemplate('BB3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async BB3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const allowance = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        injured: x.info?.injured || blank,
        fullName: x?.fullName || blank,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        rank: x.info?.rank || blank,
        role: x.info?.roleRevolution || blank,
        money: this.getVND(subsidy),
        reward: this.getReward(x.info[0]?.reward),
        decidedR: x.other?.decided || blank,
        decidedRDate: x.other?.decidedDate ? moment(x.other.decidedDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        allowance: this.getVND(allowance) || blank,
        sum: this.getVND(subsidy + allowance),
        grant: this.getVND(x.other?.allowance),
        grantText: DocSo.doc(x.other?.allowance),
        sumText: DocSo.doc(subsidy + allowance),
        join: moment(x.infoNcc[0].enlistmentDate).format("[ngày] DD [tháng] MM [năm] YYYY"),
        CATime2: x.infoNcc[0].CATime2 || 0,
        CATime1: x.infoNcc[0].CATime1 || 0,
        KKTime1: x.infoNcc[0].KKTime1 || 0,
        KKTime2: x.infoNcc[0].KKTime2 || 0,
        medicalAssessmentDate: moment(x.info[0].medicalAssessmentDate).format("[ngày] DD [tháng] MM [năm] YYYY"),
        medicalAssessmentNum: x.info[0].medicalAssessmentNum,
        enlistmentUnit: x.infoNcc[0].enlistmentUnit,
        prefers: x.prefers?.pop()?.name,
        ...this.getNewDate(x.other?.decidedDateOnce)
      });
    }
    return profiles;
  }

  loadTB3 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
      const [info, beneficiary] = [profile.info[0], profile.mainBeneficiary];
      const allowance = (profile.prefers || []).reduce((sum, item) => {
        return ( sum += +item?.allowance);
      }, 0);
      const percent = profile.prefers.find(function (prefer) {
        return `${parseInt(prefer.name)}%` === prefer.name;
      });
      const { doet, totalPreferByMonth } = profile;
      return {
        fileName: profile.fullName || 'TB3',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        injuredDate: this.#toDate(info?.injuredDate),
        verifyDate: this.#toDate(info?.verifyDate),
        inspectionBoard: info?.inspectionBoard,
        injured: info? info.injured : blank,
        percent: percent ? percent.name : 0,
        percentText: DocSo.doc(percent ? parseInt(percent.name) : 0),
        decidedDate: this.#toDate(profile.other.startDate),
        money: this.#formatCurrency(totalPreferByMonth ),
        special: this.#formatCurrency(allowance) || blank,
        sum: this.#formatCurrency(totalPreferByMonth  + allowance ),
        sumText: DocSo.doc(totalPreferByMonth  + allowance ),
        grant: profile.other.allowance || blank,
        reward: this.getReward(info?.reward),
        decidedR: info?.decided || blank,
        decidedRDate: this.#toNgayThangNam(info?.decidedDate),
        inspectionNum: info.inspectionNum,
        inspectionDate: this.#toDate(info.inspectionDate),
        ...this.getNewDate()
      };
    });
  }

  exportTB3 = async (ids: number[]) => {
    try {
      const results = await this.loadTB3(ids);
      const templateUrl = this.#getTemplate('TB3');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TB3(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const allowance = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.allowance);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      const percent = x.prefers.find(function (prefer) {
        return `${parseInt(prefer.name)}%` === prefer.name;
      });
      console.log(x);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decidedOnce || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        injuredDate: x.info[0] ? moment(x.info[0].injuredDate).format("DD/MM/YYYY") : "",
        injured: x.info[0] ? x.info[0].injured : blank,
        percent: percent ? percent.name : 0,
        percentText: DocSo.doc(percent ? parseInt(percent.name) : 0),
        decidedDate: x.other?.startDate ? moment(x.other.startDate).format("DD/MM/YYYY") : "",
        money: this.getVND(subsidy),
        special: this.getVND(allowance) || blank,
        sum: this.getVND(subsidy + allowance),
        sumText: DocSo.doc(subsidy + allowance),
        grant: this.getVND(x.other?.allowance),
        reward: this.getReward(x.info?.reward),
        decidedR: x.info?.decided || blank,
        decidedRDate: this.getDate(x.info?.decidedDate),
        inspectionNum: x.info[0].inspectionNum,
        inspectionBoard: x.info[0].inspectionBoard,
        inspectionDate: x.info[0] ? moment(x.info[0].inspectionDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        ...this.getNewDate(x.other?.decidedDateOnce)
      });
    }
    return profiles;
  }

  loadTB4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    return profiles.map(profile => {
     
      const [info] = [profile?.info[0]]
      const { doet,totalPreferByMonth } = profile;
      return {
        fileName: profile.fullName || 'TB4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile.other?.decided || blank,
        fullName: profile?.fullName,
        dob: this.#getDate(profile?.dateOfBirth),
        gender: this.getGender(profile?.gender),
        nativePlace: profile?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        decidedDate: this.#toDate(profile.other?.decidedDate),
        money: this.#formatCurrency(totalPreferByMonth),
        organ: info?.organ || blank,
        injured: info?.injured || blank,
        verifyDate: this.#toNgayThangNam(info?.verifyDate),
        percent: 12,
        percentText: DocSo.doc(12),
        // allowance: this.#formatCurrency(allowance) || blank,
        // sum: this.getVND(totalPreferByMonth),
        sumText: DocSo.doc(totalPreferByMonth),
        ...this.getNewDate(profile.other?.decidedDate)
      };
    });
  }

  exportTB4 = async (ids: number[]) => {
    try {
      const results = await this.loadTB4(ids);
      const templateUrl = this.#getTemplate('TB4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TB4(data): Promise<any> {
    const profiles = [];
    for (const x of data) {
      const subsidy = (x.prefers || []).reduce((sum, item) => {
        return (sum += +item?.subsidy);
      }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x.other?.decided || blank,
        fullName: x?.fullName,
        dob: this.getDate(x?.dateOfBirth),
        gender: this.getGender(x?.gender),
        nativePlace: x?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        decidedDate: this.getDate(x.other?.decidedDate),
        money: this.getVND(subsidy),
        organ: x.info?.organ || blank,
        injured: x.info?.injured || blank,
        verifyDate: this.getDate(x.info?.verifyDate),
        percent: 12,
        percentText: DocSo.doc(12),
        // allowance: this.getVND(allowance) || blank,
        // sum: this.getVND(subsidy),
        sumText: DocSo.doc(subsidy),
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }
 
  loadTT1 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    const categories: Category[] = [];
    for (const profile of profiles) {
      if (!profile?.categoryId) {
        categories.push(null);
      } else {
        categories.push(await this.categoryRepository.findOne(profile?.categoryId));
      }
    }
    return profiles.map((profile, idx) => {
      const { doet, other, mainBeneficiary } = profile;
      const u18 = profile.infoBeneficiary.filter(e => e.id !== mainBeneficiary.id 
        && this.#isNotEnough18(e.dateOfBirth)).map((e, idx) => ({
        stt: idx + 1,
        fullName: e.fullName,
        dob: e.dateOfBirth,
        time: blank,
        study: blank,
        school: blank,
        startDate: blank
      }));
      const relative = profile.infoBeneficiary.filter(e => e.id !== mainBeneficiary.id 
        && !this.#isNotEnough18(e.dateOfBirth)).map((e, idx) => ({
        stt: idx + 1,
        fullName: e.fullName,
        dob: e?.dateOfBirth,
        city: e?.province?.value || blank,
        relation: e?.relation || blank,
        job: blank,
        note: e?.present || blank
      }));
      const category = categories[idx];
      const subsidy = (profile.prefers || [])
        .filter((x) => x.beneficiary === Benef.Ncc)
        .reduce((sum, item) => {
          return (sum += +item?.subsidy);
        }, 0);

      const allowance = (profile.prefers || [])
        .filter((x) => x.beneficiary === Benef.Ncc)
        .reduce((sum, item) => {
          return (parseFloat(`${sum += +item?.allowance}`.replace(/,/g, '')));
        }, 0);
      return {
        fileName: profile.fullName || 'TT1',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: other?.decided || blank,
        fullNameNcc: profile?.fullName,
        dobNcc: this.#getDate(profile?.dateOfBirth),
        genderNcc: this.getGender(profile?.gender),
        nativePlaceNcc: profile?.nativePlace || blank,
        permanentNcc: this.#getPermanent(profile),
        prefer: category?.name || blank,
        percent: profile.prefers.find((y) => !!y?.other)?.other || blank,
        death: this.#toDate(mainBeneficiary?.dateOfNccDeath),
        // stopDate: this.getDate(profile?.mtp?.stopDate), Không lấy được thông tin mtp
        subsidy: this.#formatCurrency(subsidy + allowance),
        fullName: mainBeneficiary?.fullName,
        dob: this.#getDate(mainBeneficiary?.dateOfBirth),
        gender: this.getGender(mainBeneficiary?.gender),
        nativePlace: mainBeneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(mainBeneficiary),
        relation: mainBeneficiary?.relation || blank,
        default: relative.length <= 0,
        relative: relative || [],
        defaultC: u18.length <= 0,
        u18: u18 || [],
        ...this.getNewDate(profile.other?.decidedDate)
      };
    });
  }

  exportTT1 = async (ids: number[]) => {
    try {
      const results = await this.loadTT1(ids);
      const templateUrl = this.#getTemplate('TT1');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async TT1(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const benef: any = Object.values(x?.infoBeneficiary).reduce(
        (arr: any, person: any, idx) => {
          if (!!person.status) {
            arr.main = person;
          } else if (+new Date().getFullYear() - +person.dateOfBirth < 18) {
            arr.u18.push({
              stt: idx + 1,
              fullName: person.fullName,
              dob: person?.dateOfBirth,
              time: blank,
              study: blank,
              school: blank,
              startDate: blank
            });
          } else {
            arr.relative.push({
              stt: idx + 1,
              fullName: person.fullName,
              dob: person?.dateOfBirth,
              city: person.placeOfPermanent?.PROVINCE?.value || blank,
              relation: person?.relation || blank,
              job: blank,
              note: person?.present || blank
            });
          }
          return arr;
        },
        { main: {}, relative: [], u18: [] }
      );
      const prefer = await this.categoryRepository.findOne(x?.categoryId);
      const subsidy = (x.prefers || [])
        .filter((x) => x.beneficiary === Benef.Ncc)
        .reduce((sum, item) => {
          return (sum += +item?.subsidy);
        }, 0);

      const allowance = (x.prefers || [])
        .filter((x) => x.beneficiary === Benef.Ncc)
        .reduce((sum, item) => {
          return (sum += +item?.allowance);
        }, 0);
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x?.mtp?.decided || blank,
        fullNameNcc: x?.fullName,
        dobNcc: this.getDate(x?.dateOfBirth),
        genderNcc: this.getGender(x?.gender),
        nativePlaceNcc: x?.nativePlace || blank,
        permanentNcc: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        prefer: prefer?.name || blank,
        percent: x.prefers.find((y) => !!y?.other)?.other || blank,
        death: this.getDate(benef.main?.dateOfNccDeath),
        stopDate: this.getDate(x?.mtp?.stopDate),
        subsidy: this.getVND(subsidy + allowance),
        fullName: benef.main?.fullName,
        dob: this.getDate(benef.main?.dateOfBirth),
        gender: this.getGender(benef.main?.gender),
        nativePlace: benef.main?.nativePlace || blank,
        permanent: this.#getPermanent(benef.main?.permanent),
        relation: benef.main?.relation || blank,
        default: benef.relative.length <= 0,
        relative: benef?.relative || [],
        defaultC: benef.u18.length <= 0,
        u18: benef?.u18 || [],
        ...this.getNewDate(x.other?.decidedDate)
      });
    }
    return profiles;
  }


  private async TT2(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const childs: any = Object.values(x.infoBeneficiary).reduce(
        (obj: any, item: any, idx) => {
          if (!!item.status) {
            obj.main = item;
          }
          obj.relative.push({
            stt: idx + 1,
            fullName: item.fullName,
            dob: item.dateOfBirth,
            relation: item?.relation,
            money:
              +x.mtp?.allowance > 0 && !!item.status
                ? this.getVND(+x.mtp?.allowance)
                : "",
            u18:
              +x.mtp?.under18 > 0 &&
                +new Date().getFullYear() - +item.dateOfBirth < 18
                ? this.getVND(+x.mtp?.under18)
                : "",
            sum:
              +new Date().getFullYear() - +item.dateOfBirth < 18 ||
                !!item.status
                ? this.getVND(+x.mtp?.allowance + +x.mtp?.under18)
                : "",
            startDate:
              +new Date().getFullYear() - +item.dateOfBirth < 18 ||
                !!item.status
                ? this.getDate(item.mtpDate)
                : ""
          });
          return obj;
        },
        { relative: [], main: {} }
      );
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x?.mtp?.decided || blank,
        death: this.getDate(childs.main?.dateOfNccDeath),
        received: x.mtp?.type === TypeMtp.Not,
        default: childs.relative.length <= 0,
        fullName: childs.main?.fullName,
        dob: this.getDate(childs.main?.dateOfBirth),
        gender: this.getGender(childs.main?.gender),
        nativePlace: childs.main?.nativePlace || blank,
        permanent: this.#getPermanent(childs.main?.permanent),
        sum: this.getVND(x.mtp?.totalMtp),
        sumText: DocSo.doc(x.mtp?.totalMtp),
        relation: childs.main?.relation || blank,
        relative: childs?.relative,
        ...this.getNewDate(x?.mtp?.decidedDate)
      });
    }
    return profiles;
  }

  loadHS4 = async (ids: number[]) => {
    const profiles = await this.#loadProfiles(ids);
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    return profiles.map((profile, idx) => {
      const [benef, infoNcc, info] = [profile.mainBeneficiary, profile?.infoNcc[0], profile.info[0]]
      const { doet, mainBeneficiary, totalPreferByMonth} = profile;
      const children = (infoNcc?.disabilitiesChildren || []).map((item, idx) => {
        return {
          ...item,
          stt: idx + 1,
          fullName: item?.fullName || blank,
          dateOfBirth: this.#toDate(item?.dateOfBirth) || blank,
          disability: item?.disability || blank,
        };
      });
      const allowance = (profile?.prefers || []).reduce((sum, item) => {
        if(!item?.allowance){
          return 0
        }return ( sum += +item?.allowance);
      }, 0);
      return {
        fileName: profile.fullName || 'HS4',
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: profile.code,
        decided: profile?.other.decided || blank,
        death: this.#toDate(mainBeneficiary?.dateOfNccDeath),
        fullName: profile?.fullName,
        dob: this.#getDate(profile.dateOfBirth),
        gender: this.getGender(profile.gender),
        nativePlace: mainBeneficiary?.nativePlace || blank,
        permanent: this.#getPermanent(profile),
        join: this.#toDate(infoNcc?.enlistmentDate),
        decidedDate: this.#toNgayThangNam(profile?.other?.decidedDate),
        proof: infoNcc?.proof,
        unit: infoNcc?.unit,
        children,
        disabilityCondition: infoNcc?.disabilityCondition,
        totalPreferByMonth: this.#formatCurrency(totalPreferByMonth + allowance) || blank,
        totalPreferByMonthText: DocSo.doc(totalPreferByMonth) || blank,
        medicalAssessmentDate: this.#toNgayThangNam(info?.medicalAssessmentDate) || blank,
        medicalAssessmentNum: info?.medicalAssessmentNum || blank,
        of: info?.of,
        prefersName: profile?.prefers?.pop()?.name,
        certificationDate: this.#toNgayThangNam(info?.certificationDate),
        certificationNum: info?.certificationNum,
        ofCDHH: info?.ofCDHH,
        infoBeneficiaryFullname: benef?.fullName,
        ...this.getNewDate()
      };
    });
  }

  exportHS4 = async (ids: number[]) => {
    try {
      const results = await this.loadHS4(ids);
      const templateUrl = this.#getTemplate('HS4');
      return await this.#export(templateUrl, results);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  private async HS4(data): Promise<any> {
    const profiles = [];
    filters.lower = function (input) {
      if (!input) return input;
      return input.toLowerCase();
    };
    for (const x of data) {
      const childs: any = Object.values(x.infoBeneficiary).reduce(
        (obj: any, item: any, idx) => {
          if (!!item.status) {
            obj.main = item;
          }
          obj.relative.push({
            stt: idx + 1,
            fullName: item.fullName,
            dob: item.dateOfBirth,
            relation: item?.relation,
            money:
              +x.mtp?.allowance > 0 && !!item.status
                ? this.getVND(+x.mtp?.allowance)
                : "",
            u18:
              +x.mtp?.under18 > 0 &&
                +new Date().getFullYear() - +item.dateOfBirth < 18
                ? this.getVND(+x.mtp?.under18)
                : "",
            sum:
              +new Date().getFullYear() - +item.dateOfBirth < 18 ||
                !!item.status
                ? this.getVND(+x.mtp?.allowance + +x.mtp?.under18)
                : "",
            startDate:
              +new Date().getFullYear() - +item.dateOfBirth < 18 ||
                !!item.status
                ? this.getDate(item.mtpDate)
                : ""
          });
          return obj;
        }, {
        relative: [],
        main: {}
      });
      const relatives =
        x?.infoBeneficiary
          .filter((value) => !value.status)
          .map((value, y) => {
            return {
              stt: y + 1,
              fullName: value?.fullName || blank,
              dob: this.getDate(value?.dateOfBirth),
              relation: value?.relation || blank,
              address: value?.placeOfPermanent?.address || blank
            };
          }) || [];
      const doet = await this.getUnit(x.doet_id);
      profiles.push({
        PROVINCE: doet.toUpperCase(),
        province: capitalizeTheFirstLetterOfEachWord(doet),
        code: x.code,
        decided: x?.mtp?.decided || blank,
        death: this.getDate(childs.main?.dateOfNccDeath),
        received: x.mtp?.type === TypeMtp.Not,
        default: childs.relative.length <= 0,
        fullName: x?.fullName,
        dob: x.dateOfBirth,
        gender: this.getGender(x.gender),
        nativePlace: childs.main?.nativePlace || blank,
        permanent: `${x.ward.value}, ${x.district.value}, ${x.province.value} `,
        join: x.infoNcc[0] ? moment(x.infoNcc[0].enlistmentDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        proof: x.infoNcc[0]?.proof,
        unit: x.infoNcc[0]?.unit,
        disabilityCondition: x.infoNcc[0]?.disabilityCondition,
        sum: this.getVND(x.mtp?.totalMtp),
        sumText: DocSo.doc(x.mtp?.totalMtp),
        relation: childs.main?.relation || blank,
        relative: childs?.relative,
        medicalAssessmentDate: x.infoNcc[0] ? moment(x.info[0].medicalAssessmentDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        medicalAssessmentNum: x.info[0].medicalAssessmentNum,
        of: x.info[0]?.of,
        prefersName: x.prefers?.pop()?.name,
        certificationDate: x.infoNcc[0] ? moment(x.info[0].certificationDate).format("[ngày] DD [tháng] MM [năm] YYYY") : "",
        certificationNum: x.info[0]?.certificationNum,
        ofCDHH: x.info[0]?.ofCDHH,
        infoBeneficiaryFullname: x.infoBeneficiary[0]?.fullname,
        relatives,
        relativesCount: relatives.length !== 0,
        ...this.getNewDate(x?.mtp?.decidedDate)
      });
    }
    return profiles;
  }

  async getUnit(id) {
    if (id) {
      const doet = await this.doetRepository.findOne(id, {
        select: [
          "parentId",
          "province",
          "district"
        ]
      });
      if (doet) {
        if (doet.parentId) {
          return doet.district.value || blank;
        } else {
          return doet.province.value || blank;
        }
      }
    }
    return blank;
  }

  getDate(date) {
    return date;
    // if (date) {
    //   return moment(date)
    //     .add(1, "day")
    //     .format("DD/MM/YYYY");
    // }
    // return "..................";
  }

  getNewDate(date = null) {
    let _date = new Date();
    if (date)
      _date = new Date(date);
    return {
      d: _date.getDate(),
      m: _date.getMonth() + 1,
      y: _date.getFullYear()
    };
  }

  #getPermanent = (place: PlaceOfPermanent) => {
    if (!place) {
      return blank;
    }
    const { ward, district, province } = place;
    return `${ward?.value || ''}, ${district?.value || ''}, ${province?.value || ''}`;
  }

  getGender(gender: Gender): string {
    if (gender === Gender.male) {
      return "Nữ";
    }
    if (gender === Gender.female) {
      return "Nam";
    }
    return "...........";
  }

  #getTemplate = (template: string) => {
    return fs.readFileSync(
      path.resolve(
        __dirname,
        `${process.env.dirTemp}/${template}.${ReportFormat.DOCX}`
      ),
      "binary"
    );
  }

  getTemplate(temp: ReportTemplate) {
    return fs.readFileSync(
      path.resolve(
        __dirname,
        `${process.env.dirTemp}/${temp}.${ReportFormat.DOCX}`
      ),
      "binary"
    );
  }

  getReward(numb:number) {
    const reward = {
      0: "Huân chương Chiến thắng hạng nhất",
      1: "Huân chương Chiến thắng hạng nhì",
      2: "Huân chương Chiến thắng hạng ba",
      3: "Huy chương Chiến thắng hạng nhất",
      4: "Huy chương Chiến thắng hạng nhì",
      5: "Huy chương Chiến thắng hạng ba",
      6: "Huân chương Kháng chiến chống Pháp hạng nhất",
      7: "Huân chương Kháng chiến chống Pháp hạng nhì",
      8: "Huân chương Kháng chiến chống Pháp hạng ba",
      9: "Huân chương",
      10: "Huy chương",
      11: "Bằng khen"
    };
    return reward[numb] || '.......................';
  }

  getVND(numb) {
    return (
      (numb &&
        new Intl.NumberFormat("vi-VN", {
          currency: "VND"
        }).format(+numb)) ||
      "................"
    );
  }

  #formatCurrency = (val: number) => {
    if (!val) {
      return blank;
    }
    return (
      (val &&
        new Intl.NumberFormat("vi-VN", {
          currency: "VND"
        }).format(+val)) ||
      blank
    );
  }
  
  #parseFloat = (val: string) => {
    if(!val){
      return 0
    }
    return  parseFloat(`${val}`.replace(/,/g, ''))
  }

  #isNotEnough18 = (date: string) => {
    if (!date) {
      return false;
    }
    if (date.includes('T') && date.includes('Z') && this.#isDate(date)) {
      const year = new Date(date).getFullYear();
      return new Date().getFullYear() - year < 18;
    }
    const year = date.substring(date.length - 4, date.length);
    if (year.length === 4 && +year > 0) {
      return new Date().getFullYear() - +year < 18;
    }
    return false;
  }

  #isDate = (value: any) => {
    if (!value) {
      return false;
    }
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  #getDate = (date: string) => {
    if (!date) {
      return '';
    }
    if (date.includes('T') && date.includes('Z') && this.#isDate(date)) {
      return this.#toDate(date);
    }
    return date;
  }

  #toDate = (date: Date | string) => {
    if (!date) {
      return ''
    }
    date = new Date(date);
    if (date.getHours() === 17) {
      date.setHours(date.getHours() + 7); // Đang bị -7 do timezone
    }
    if (date.getHours() === 16) {
      date.setHours(date.getHours() + 8); // Đang bị -8 do timezone
    }
    if (date.getHours() === 15) {
      date.setHours(date.getHours() + 9); // Đang bị -9 do timezone
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  #toNgayThangNam = (date: Date | string) => {
    if (!date) {
      return ''
    }
    date = new Date(date);
    if (date.getHours() === 17) {
      date.setHours(date.getHours() + 7); // Đang bị -7 do timezone
    }
    if (date.getHours() === 16) {
      date.setHours(date.getHours() + 8); // Đang bị -8 do timezone
    }
    if (date.getHours() === 15) {
      date.setHours(date.getHours() + 9); // Đang bị -9 do timezone
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `ngày ${day} tháng ${month} năm ${year}`;
  }
}

function capitalizeTheFirstLetterOfEachWord(words) {
  const separateWord = words.toLowerCase().split(" ");
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
      separateWord[i].substring(1);
  }
  return separateWord.join(" ");
}

type ProfileDTO = (Profile & {
  doet?: string;
  aRelative?: (InfoBeneficiary & { stt: number, dob: string })[];
  mainInfo?: Info;
  mainInfoNcc?: InfoNcc;
  mainBeneficiary?: InfoBeneficiary;
  totalPreferByMonth?: number;
  totalPreferByYear?: number;
  totalPreferOnce?: number;
})