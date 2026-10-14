import { EntityManager, getManager, Repository } from "typeorm";
import { Workbook } from "exceljs";
import { Category } from "../category/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "../profile/profile.entity";
import { Preferential } from "../preferential/preferential.entity";
import { Year } from "../year/year.entity";
import { ListProfiles } from "../list/list.entity";

export class StatisticService {
  manager: EntityManager;

  constructor(
    @InjectRepository(Year)
    private readonly yearRepository: Repository<Year>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Preferential)
    private readonly preferentialRepository: Repository<Preferential>,
    @InjectRepository(ListProfiles)
    private readonly listProfilesRepository: Repository<ListProfiles>) {
    this.manager = getManager();
  }

  async export(start, end, type, doet_id) {
    switch (type) {
      case "bao-cao-so-luong-doi-tuong-dang-huong-tro-cap-hang-thang":
        return this.#statistic01(start, end);
      case "bao-cao-so-lieu-chi-tiet-thuong-binh-thuong-binh-loai-b":
        return this.#statistic02(start, end);
      case "bao-cao-so-luong-doi-tuong-dang-huong-tro-cap-uu-dai-trong-giao-duc":
        return this.BaoCaoSoLuongDoiTuongDangHuongTroCapUuDaiTrongGiaoDuc(start, end, doet_id);
    }
  }

  private BaoCaoSoLuongDoiTuongDagHuongTroCapHangThang(start, end, doet_id) {
    const workbook = new Workbook();
    const manager = this.manager;
    return new Promise(function (resolve) {
      workbook.xlsx.readFile(`./src/commons/templates/statistic-1.xlsx`).then(async function () {
        let a;
        const worksheet = workbook.getWorksheet("bieu-mau-1");
        let total = 0;
        const I1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 5}]')`
        );
        const I2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 6}]')`
        );
        const I3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 7}]')`
        );
        const row8 = worksheet.findRow(8);
        total += parseInt(I1[0].count) + parseInt(I2[0].count) + parseInt(I3[0].count);
        row8.getCell(3).value = parseInt(I1[0].count) + parseInt(I2[0].count) + parseInt(I3[0].count);
        const row9 = worksheet.findRow(9);
        row9.getCell(3).value = parseInt(I1[0].count);
        const row10 = worksheet.findRow(10);
        row10.getCell(3).value = parseInt(I2[0].count);
        const row11 = worksheet.findRow(11);
        row11.getCell(3).value = parseInt(I3[0].count);
        const II1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 124}]')`
        );
        const II2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 35}]')`
        );
        const row12 = worksheet.findRow(12);
        total += parseInt(II1[0].count) + parseInt(II2[0].count);
        row12.getCell(3).value = parseInt(II1[0].count) + parseInt(II2[0].count);
        const row13 = worksheet.findRow(13);
        row13.getCell(3).value = parseInt(II1[0].count);
        const row14 = worksheet.findRow(14);
        row14.getCell(3).value = parseInt(II2[0].count);
        const III1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 32}]') or
                   (prefers @> '[{"id": 156}]') or
                   (prefers @> '[{"id": 155}]') or
                   (prefers @> '[{"id": 154}]') or
                   (prefers @> '[{"id": 153}]') or
                   (prefers @> '[{"id": 152}]') or
                   (prefers @> '[{"id": 151}]') or
                   (prefers @> '[{"id": 150}]') or
                   (prefers @> '[{"id": 149}]') or
                   (prefers @> '[{"id": 148}]') or
                   (prefers @> '[{"id": 147}]') or
                   (prefers @> '[{"id": 146}]') or
                   (prefers @> '[{"id": 145}]') or
                   (prefers @> '[{"id": 142}]') or
                   (prefers @> '[{"id": 141}]') or
                   (prefers @> '[{"id": 140}]') or
                   (prefers @> '[{"id": 139}]') or
                   (prefers @> '[{"id": 138}]') or
                   (prefers @> '[{"id": 137}]') or
                   (prefers @> '[{"id": 136}]') or
                   (prefers @> '[{"id": 135}]') or
                   (prefers @> '[{"id": 134}]') or
                   (prefers @> '[{"id": 133}]') or
                   (prefers @> '[{"id": 132}]') or
                   (prefers @> '[{"id": 131}]') or
                   (prefers @> '[{"id": 129}]') or
                   (prefers @> '[{"id": 128}]') or
                   (prefers @> '[{"id": 126}]') or
                   (prefers @> '[{"id": 125}]') or
                   (prefers @> '[{"id": 123}]') or
                   (prefers @> '[{"id": 122}]') or
                   (prefers @> '[{"id": 121}]') or
                   (prefers @> '[{"id": 120}]') or
                   (prefers @> '[{"id": 119}]') or
                   (prefers @> '[{"id": 118}]') or
                   (prefers @> '[{"id": 115}]') or
                   (prefers @> '[{"id": 113}]') or
                   (prefers @> '[{"id": 112}]') or
                   (prefers @> '[{"id": 111}]') or
                   (prefers @> '[{"id": 109}]')
               )`
        );
        const III2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 108}]') or
                   (prefers @> '[{"id": 107}]') or
                   (prefers @> '[{"id": 105}]') or
                   (prefers @> '[{"id": 103}]') or
                   (prefers @> '[{"id": 102}]') or
                   (prefers @> '[{"id": 100}]') or
                   (prefers @> '[{"id": 99}]') or
                   (prefers @> '[{"id": 98}]') or
                   (prefers @> '[{"id": 97}]') or
                   (prefers @> '[{"id": 95}]') or
                   (prefers @> '[{"id": 94}]') or
                   (prefers @> '[{"id": 92}]') or
                   (prefers @> '[{"id": 91}]') or
                   (prefers @> '[{"id": 89}]') or
                   (prefers @> '[{"id": 88}]') or
                   (prefers @> '[{"id": 87}]') or
                   (prefers @> '[{"id": 86}]') or
                   (prefers @> '[{"id": 85}]') or
                   (prefers @> '[{"id": 83}]') or
                   (prefers @> '[{"id": 82}]')
               )`
        );
        const III3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 80}]') or
                   (prefers @> '[{"id": 79}]') or
                   (prefers @> '[{"id": 77}]') or
                   (prefers @> '[{"id": 76}]') or
                   (prefers @> '[{"id": 75}]') or
                   (prefers @> '[{"id": 73}]') or
                   (prefers @> '[{"id": 72}]') or
                   (prefers @> '[{"id": 71}]') or
                   (prefers @> '[{"id": 69}]') or
                   (prefers @> '[{"id": 68}]') or
                   (prefers @> '[{"id": 67}]') or
                   (prefers @> '[{"id": 66}]') or
                   (prefers @> '[{"id": 65}]') or
                   (prefers @> '[{"id": 64}]') or
                   (prefers @> '[{"id": 63}]') or
                   (prefers @> '[{"id": 62}]') or
                   (prefers @> '[{"id": 61}]') or
                   (prefers @> '[{"id": 60}]') or
                   (prefers @> '[{"id": 59}]')
               )`
        );
        const III4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 0}]')`
        );
        const row15 = worksheet.findRow(15);
        total += parseInt(III1[0].count) + parseInt(III2[0].count) + parseInt(III3[0].count) + parseInt(III4[0].count);
        row15.getCell(3).value = parseInt(III1[0].count) + parseInt(III2[0].count) + parseInt(III3[0].count) + parseInt(III4[0].count);
        const row16 = worksheet.findRow(16);
        row16.getCell(3).value = parseInt(II1[0].count);
        const row17 = worksheet.findRow(17);
        row17.getCell(3).value = parseInt(II2[0].count);
        const row18 = worksheet.findRow(17);
        row18.getCell(3).value = parseInt(III3[0].count);
        const row19 = worksheet.findRow(17);
        row19.getCell(3).value = parseInt(III4[0].count);
        const IV1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 252}]') or
                   (prefers @> '[{"id": 253}]') or
                   (prefers @> '[{"id": 256}]') or
                   (prefers @> '[{"id": 258}]') or
                   (prefers @> '[{"id": 260}]') or
                   (prefers @> '[{"id": 262}]') or
                   (prefers @> '[{"id": 264}]') or
                   (prefers @> '[{"id": 266}]') or
                   (prefers @> '[{"id": 268}]') or
                   (prefers @> '[{"id": 269}]') or
                   (prefers @> '[{"id": 270}]') or
                   (prefers @> '[{"id": 271}]') or
                   (prefers @> '[{"id": 274}]') or
                   (prefers @> '[{"id": 276}]') or
                   (prefers @> '[{"id": 278}]') or
                   (prefers @> '[{"id": 279}]') or
                   (prefers @> '[{"id": 280}]') or
                   (prefers @> '[{"id": 281}]') or
                   (prefers @> '[{"id": 282}]') or
                   (prefers @> '[{"id": 283}]') or
                   (prefers @> '[{"id": 284}]') or
                   (prefers @> '[{"id": 285}]') or
                   (prefers @> '[{"id": 286}]') or
                   (prefers @> '[{"id": 287}]') or
                   (prefers @> '[{"id": 288}]') or
                   (prefers @> '[{"id": 289}]') or
                   (prefers @> '[{"id": 290}]') or
                   (prefers @> '[{"id": 291}]') or
                   (prefers @> '[{"id": 292}]') or
                   (prefers @> '[{"id": 293}]') or
                   (prefers @> '[{"id": 294}]') or
                   (prefers @> '[{"id": 295}]') or
                   (prefers @> '[{"id": 296}]') or
                   (prefers @> '[{"id": 297}]') or
                   (prefers @> '[{"id": 298}]') or
                   (prefers @> '[{"id": 299}]') or
                   (prefers @> '[{"id": 300}]') or
                   (prefers @> '[{"id": 301}]') or
                   (prefers @> '[{"id": 302}]') or
                   (prefers @> '[{"id": 303}]')
               )`
        );
        const IV2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 304}]') or
                   (prefers @> '[{"id": 305}]') or
                   (prefers @> '[{"id": 306}]') or
                   (prefers @> '[{"id": 307}]') or
                   (prefers @> '[{"id": 308}]') or
                   (prefers @> '[{"id": 309}]') or
                   (prefers @> '[{"id": 310}]') or
                   (prefers @> '[{"id": 311}]') or
                   (prefers @> '[{"id": 312}]') or
                   (prefers @> '[{"id": 313}]') or
                   (prefers @> '[{"id": 314}]') or
                   (prefers @> '[{"id": 315}]') or
                   (prefers @> '[{"id": 316}]') or
                   (prefers @> '[{"id": 317}]') or
                   (prefers @> '[{"id": 318}]') or
                   (prefers @> '[{"id": 319}]') or
                   (prefers @> '[{"id": 320}]') or
                   (prefers @> '[{"id": 321}]') or
                   (prefers @> '[{"id": 322}]') or
                   (prefers @> '[{"id": 323}]')
               )`
        );
        const IV3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (
                   (prefers @> '[{"id": 324}]') or
                   (prefers @> '[{"id": 325}]') or
                   (prefers @> '[{"id": 326}]') or
                   (prefers @> '[{"id": 327}]') or
                   (prefers @> '[{"id": 328}]') or
                   (prefers @> '[{"id": 329}]') or
                   (prefers @> '[{"id": 330}]') or
                   (prefers @> '[{"id": 331}]') or
                   (prefers @> '[{"id": 332}]') or
                   (prefers @> '[{"id": 333}]') or
                   (prefers @> '[{"id": 334}]') or
                   (prefers @> '[{"id": 335}]') or
                   (prefers @> '[{"id": 336}]') or
                   (prefers @> '[{"id": 337}]') or
                   (prefers @> '[{"id": 338}]') or
                   (prefers @> '[{"id": 339}]') or
                   (prefers @> '[{"id": 340}]') or
                   (prefers @> '[{"id": 341}]') or
                   (prefers @> '[{"id": 342}]')
               )`
        );
        const IV4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 0}]')`
        );
        total += parseInt(IV1[0].count) + parseInt(IV2[0].count) + parseInt(IV3[0].count) + parseInt(IV4[0].count);
        const row20 = worksheet.findRow(20);
        row20.getCell(3).value = parseInt(IV1[0].count) + parseInt(IV2[0].count) + parseInt(IV3[0].count) + parseInt(IV4[0].count);
        const row21 = worksheet.findRow(21);
        row21.getCell(3).value = parseInt(IV1[0].count);
        const row22 = worksheet.findRow(22);
        row22.getCell(3).value = parseInt(IV2[0].count);
        const row23 = worksheet.findRow(23);
        row23.getCell(3).value = parseInt(IV3[0].count);
        const row24 = worksheet.findRow(24);
        row24.getCell(3).value = parseInt(IV4[0].count);
        const V1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 17}]')`
        );
        const V2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 18}]')`
        );
        const V3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 19}]')`
        );
        const V4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 20}]')`
        );
        const V5 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 0}]')`
        );
        total += parseInt(V1[0].count) + parseInt(V2[0].count) + parseInt(V3[0].count) + parseInt(V4[0].count) + parseInt(V5[0].count);
        const row25 = worksheet.findRow(25);
        row25.getCell(3).value = parseInt(V1[0].count) + parseInt(V2[0].count) + parseInt(V3[0].count) + parseInt(V4[0].count) + parseInt(V5[0].count);
        const row26 = worksheet.findRow(26);
        row26.getCell(3).value = parseInt(V2[0].count);
        const row27 = worksheet.findRow(27);
        row27.getCell(3).value = parseInt(V3[0].count);
        const row28 = worksheet.findRow(28);
        row28.getCell(3).value = parseInt(V4[0].count);
        const row29 = worksheet.findRow(29);
        row29.getCell(3).value = parseInt(V5[0].count);
        const VI1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 15}]')`
        );
        const VI2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        total += parseInt(VI1[0].count) + parseInt(VI2[0].count);
        const row31 = worksheet.findRow(31);
        row31.getCell(3).value = parseInt(VI1[0].count) + parseInt(VI2[0].count);
        const row32 = worksheet.findRow(32);
        row32.getCell(3).value = parseInt(VI1[0].count);
        const row33 = worksheet.findRow(33);
        row33.getCell(3).value = parseInt(VI2[0].count);
        const VII1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 15}]')`
        );
        const VII2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VII3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 15}]')`
        );
        const VII4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        total += parseInt(VII1[0].count) + parseInt(VII2[0].count) + parseInt(VII3[0].count) + parseInt(VII4[0].count);
        const row34 = worksheet.findRow(34);
        row34.getCell(3).value = parseInt(VII1[0].count) + parseInt(VII2[0].count) + parseInt(VII3[0].count) + parseInt(VII4[0].count);
        const row35 = worksheet.findRow(35);
        row35.getCell(3).value = parseInt(VI1[0].count);
        const row36 = worksheet.findRow(36);
        row36.getCell(3).value = parseInt(VI2[0].count);
        const row37 = worksheet.findRow(37);
        row37.getCell(3).value = parseInt(VI1[0].count);
        const row38 = worksheet.findRow(38);
        row38.getCell(3).value = parseInt(VI2[0].count);
        const VIII1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 104}]')`
        );
        const VIII2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 106}]')`
        );
        const VIII3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 116}]')`
        );
        const VIII4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 117}]')`
        );
        const VIII5 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII6 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII7 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII8 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII9 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII10 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII11 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII12 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const VIII13 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 16}]')`
        );
        const row39 = worksheet.findRow(39);
        total +=
          parseInt(VIII1[0].count) +
          parseInt(VIII2[0].count) +
          parseInt(VIII3[0].count) +
          parseInt(VIII4[0].count) +
          parseInt(VIII5[0].count) +
          parseInt(VIII6[0].count) +
          parseInt(VIII7[0].count) +
          parseInt(VIII8[0].count) +
          parseInt(VIII9[0].count) +
          parseInt(VIII10[0].count) +
          parseInt(VIII11[0].count) +
          parseInt(VIII12[0].count) +
          parseInt(VIII13[0].count);
        row39.getCell(3).value =
          parseInt(VIII1[0].count) +
          parseInt(VIII2[0].count) +
          parseInt(VIII3[0].count) +
          parseInt(VIII4[0].count) +
          parseInt(VIII5[0].count) +
          parseInt(VIII6[0].count) +
          parseInt(VIII7[0].count) +
          parseInt(VIII8[0].count) +
          parseInt(VIII9[0].count) +
          parseInt(VIII10[0].count) +
          parseInt(VIII11[0].count) +
          parseInt(VIII12[0].count) +
          parseInt(VIII13[0].count);
        const row40 = worksheet.findRow(40);
        row40.getCell(3).value = parseInt(VIII1[0].count);
        const row41 = worksheet.findRow(41);
        row41.getCell(3).value = parseInt(VIII2[0].count);
        worksheet.findRow(42).getCell(3).value = parseInt(VIII3[0].count);
        worksheet.findRow(43).getCell(3).value = parseInt(VIII4[0].count);
        const row44 = worksheet.findRow(44);
        row44.getCell(3).value = parseInt(VIII5[0].count);
        const row45 = worksheet.findRow(45);
        row45.getCell(3).value = parseInt(VIII6[0].count);
        const row46 = worksheet.findRow(46);
        row46.getCell(3).value = parseInt(VIII7[0].count);
        const row47 = worksheet.findRow(47);
        row47.getCell(3).value = parseInt(VIII8[0].count);
        const row48 = worksheet.findRow(48);
        row48.getCell(3).value = parseInt(VIII9[0].count);
        const row49 = worksheet.findRow(49);
        row49.getCell(3).value = parseInt(VIII10[0].count);
        const row50 = worksheet.findRow(50);
        row50.getCell(3).value = parseInt(VIII11[0].count);
        const row51 = worksheet.findRow(51);
        row51.getCell(3).value = parseInt(VIII12[0].count);
        const row52 = worksheet.findRow(52);
        row52.getCell(3).value = parseInt(VIII13[0].count);


        const IX1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 28}]')`
        );
        const IX2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 29}]')`
        );
        const IX3 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and ((prefers @> '[{"id": 18}]') or (prefers @> '[{"id": 17}]'))`
        );
        const IX4 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 172}]')`
        );
        const IX5 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and ((prefers @> '[{"id": 15}]') or (prefers @> '[{"id": 16}]'))`
        );
        const row58 = worksheet.findRow(58);
        total += parseInt(IX1[0].count) + parseInt(IX2[0].count) + parseInt(IX3[0].count) + parseInt(IX4[0].count) + parseInt(IX5[0].count);
        row58.getCell(3).value = parseInt(IX1[0].count) + parseInt(IX2[0].count) + parseInt(IX3[0].count) + parseInt(IX4[0].count) + parseInt(IX5[0].count);
        const row59 = worksheet.findRow(59);
        row59.getCell(3).value = parseInt(IX1[0].count);
        const row60 = worksheet.findRow(60);
        row60.getCell(3).value = parseInt(IX2[0].count);
        const row61 = worksheet.findRow(61);
        row61.getCell(3).value = parseInt(IX3[0].count);
        worksheet.findRow(62).getCell(3).value = parseInt(IX4[0].count);
        const row63 = worksheet.findRow(63);
        row63.getCell(3).value = parseInt(IX5[0].count);
        const X1 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 198}]')`
        );
        const X2 = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 197}]')`
        );
        const row64 = worksheet.findRow(64);
        total += parseInt(X1[0].count) + parseInt(X2[0].count);
        row64.getCell(3).value = parseInt(X1[0].count) + parseInt(X2[0].count);
        const row65 = worksheet.findRow(65);
        row65.getCell(3).value = parseInt(X1[0].count);
        const row66 = worksheet.findRow(66);
        row66.getCell(3).value = parseInt(X2[0].count);
        const XII = await manager.query(
          `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 197}]')`
        );
        const row67 = worksheet.findRow(67);
        row67.getCell(3).value = parseInt(XII[0].count);
        const row71 = worksheet.findRow(71);
        row71.getCell(3).value = total;
        return resolve(workbook.xlsx.writeBuffer());
      });
    });
  }

  #loadCategories = async () => {
    return await this.categoryRepository.find({
      where: {
        status: true
      }
    });
  }

  #statistic01 = async (start: string, end: string) => {
    const year = new Date(start).getFullYear();
    const foundYear = await this.yearRepository.findOne({
      where: {
        year
      }
    });
    const yearId = foundYear?.id;
    if (!yearId) {
      throw new Error('Không tìm thấy thông tin năm');
    }
    const categories = await this.#loadCategories();
    const workbook = new Workbook();
    await workbook.xlsx.readFile('./src/commons/templates/statistic-1.xlsx');
    const worksheet = workbook.getWorksheet("bieu-mau-1");
    let row = 8;
    for (const category of categories) {
      let categoryRow = row;
      let categoryTotal = 0;
      const preferentials = await this.preferentialRepository.find({
        where: {
          yearId,
          categoryId: category.id,
          status: true,
          subsidyForm: 1
        },
        relations: []
      });
      row++;
      for (const preferential of preferentials) {
        const listProfiles = await this.listProfilesRepository
          .createQueryBuilder('lp')
          .select()
          // .where('lp.createdAt > :startDate AND lp.createdAt < :endDate AND lp.prefers ::jsonb @> :prefers', {
          .where('lp.prefers ::jsonb @> :prefers', {
            // startDate: `${start} 00:00:00`,
            // endDate: `${end} 23:59:59`,
            prefers: JSON.stringify([preferential.id])
          })
          .printSql()
          .getMany();
        const count = listProfiles.length;
        // Set tiêu đề
        worksheet.getCell(row, 2).value = preferential.name;
        // Set giá trị 
        worksheet.getCell(row, 3).value = count;
        // Set style
        worksheet.getCell(row, 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getCell(row, 2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getCell(row, 3).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        categoryTotal += count
        row++;
      }
      // Set tiêu đề
      worksheet.getCell(categoryRow, 2).value = category.name;
      // Set total
      worksheet.getCell(categoryRow, 3).value = categoryTotal;
      // Set style
      worksheet.getCell(categoryRow, 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      worksheet.getCell(categoryRow, 2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      worksheet.getCell(categoryRow, 3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    return workbook.xlsx.writeBuffer();
  }

  BaoCaoSoLieuChiTietThuongBinhThuongBinhLoaiB(start, end, doet_id) {
    const workbook = new Workbook();
    const manager = this.manager;
    return new Promise(function (resolve) {
      let a;
      workbook
        .xlsx
        .readFile(`./src/commons/templates/statistic-2.xlsx`)
        .then(async function () {
          const worksheet = workbook.getWorksheet("bieu-mau-2");
          const I11 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 156}]')`
          );
          worksheet.findRow(11).getCell(3).value = parseInt(I11[0].count);
          const I12 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 155}]')`
          );
          worksheet.findRow(12).getCell(3).value = parseInt(I12[0].count);
          const I13 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 154}]')`
          );
          worksheet.findRow(13).getCell(3).value = parseInt(I13[0].count);
          const I14 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 153}]')`
          );
          worksheet.findRow(14).getCell(3).value = parseInt(I14[0].count);
          const I15 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 152}]')`
          );
          worksheet.findRow(15).getCell(3).value = parseInt(I15[0].count);
          const I16 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 151}]')`
          );
          worksheet.findRow(16).getCell(3).value = parseInt(I16[0].count);
          const I17 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 150}]')`
          );
          worksheet.findRow(17).getCell(3).value = parseInt(I17[0].count);
          const I18 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 149}]')`
          );
          worksheet.findRow(18).getCell(3).value = parseInt(I18[0].count);
          const I19 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 148}]')`
          );
          worksheet.findRow(19).getCell(3).value = parseInt(I19[0].count);
          const I110 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 147}]')`
          );
          worksheet.findRow(20).getCell(3).value = parseInt(I110[0].count);
          const I111 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 146}]')`
          );
          worksheet.findRow(21).getCell(3).value = parseInt(I111[0].count);
          const I112 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 145}]')`
          );
          worksheet.findRow(22).getCell(3).value = parseInt(I112[0].count);
          const I113 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 142}]')`
          );
          worksheet.findRow(23).getCell(3).value = parseInt(I113[0].count);
          const I114 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 141}]')`
          );
          worksheet.findRow(24).getCell(3).value = parseInt(I114[0].count);
          const I115 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 140}]')`
          );
          worksheet.findRow(25).getCell(3).value = parseInt(I115[0].count);
          const I116 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 139}]')`
          );
          worksheet.findRow(26).getCell(3).value = parseInt(I116[0].count);
          const I117 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 138}]')`
          );
          worksheet.findRow(27).getCell(3).value = parseInt(I117[0].count);
          const I118 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 137}]')`
          );
          worksheet.findRow(28).getCell(3).value = parseInt(I118[0].count);
          const I119 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 136}]')`
          );
          worksheet.findRow(29).getCell(3).value = parseInt(I119[0].count);
          const I120 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 135}]')`
          );
          worksheet.findRow(30).getCell(3).value = parseInt(I120[0].count);
          const I121 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 134}]')`
          );
          worksheet.findRow(31).getCell(3).value = parseInt(I121[0].count);
          const I122 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 133}]')`
          );
          worksheet.findRow(32).getCell(3).value = parseInt(I122[0].count);
          const I123 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 132}]')`
          );
          worksheet.findRow(33).getCell(3).value = parseInt(I123[0].count);
          const I124 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 131}]')`
          );
          worksheet.findRow(34).getCell(3).value = parseInt(I124[0].count);
          const I125 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 129}]')`
          );
          worksheet.findRow(35).getCell(3).value = parseInt(I125[0].count);
          const I126 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 128}]')`
          );
          worksheet.findRow(36).getCell(3).value = parseInt(I126[0].count);
          const I127 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 126}]')`
          );
          worksheet.findRow(37).getCell(3).value = parseInt(I127[0].count);
          const I128 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 125}]')`
          );
          worksheet.findRow(38).getCell(3).value = parseInt(I128[0].count);
          const I129 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 123}]')`
          );
          worksheet.findRow(39).getCell(3).value = parseInt(I129[0].count);
          const I130 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 122}]')`
          );
          worksheet.findRow(40).getCell(3).value = parseInt(I130[0].count);
          const I131 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 121}]')`
          );
          worksheet.findRow(41).getCell(3).value = parseInt(I131[0].count);
          const I132 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 120}]')`
          );
          worksheet.findRow(42).getCell(3).value = parseInt(I132[0].count);
          const I133 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 119}]')`
          );
          worksheet.findRow(43).getCell(3).value = parseInt(I133[0].count);
          const I134 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 118}]')`
          );
          worksheet.findRow(44).getCell(3).value = parseInt(I134[0].count);
          const I135 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 115}]')`
          );
          worksheet.findRow(45).getCell(3).value = parseInt(I135[0].count);
          const I136 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 113}]')`
          );
          worksheet.findRow(46).getCell(3).value = parseInt(I136[0].count);
          const I137 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 112}]')`
          );
          worksheet.findRow(47).getCell(3).value = parseInt(I137[0].count);
          const I138 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 111}]')`
          );
          worksheet.findRow(48).getCell(3).value = parseInt(I138[0].count);
          const I139 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 110}]')`
          );
          worksheet.findRow(49).getCell(3).value = parseInt(I139[0].count);
          const I21 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 109}]')`
          );
          worksheet.findRow(50).getCell(3).value = parseInt(I21[0].count);

          const I22 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 108}]')`
          );
          worksheet.findRow(52).getCell(3).value = parseInt(I22[0].count);
          const I23 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 107}]')`
          );
          worksheet.findRow(53).getCell(3).value = parseInt(I23[0].count);
          const I24 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 105}]')`
          );
          worksheet.findRow(54).getCell(3).value = parseInt(I24[0].count);
          const I25 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 103}]')`
          );
          worksheet.findRow(55).getCell(3).value = parseInt(I25[0].count);
          const I26 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 102}]')`
          );
          worksheet.findRow(56).getCell(3).value = parseInt(I26[0].count);
          const I27 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 100}]')`
          );
          worksheet.findRow(57).getCell(3).value = parseInt(I27[0].count);
          const I28 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 99}]')`
          );
          worksheet.findRow(58).getCell(3).value = parseInt(I28[0].count);
          const I29 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 98}]')`
          );
          worksheet.findRow(59).getCell(3).value = parseInt(I29[0].count);
          const I210 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 97}]')`
          );
          worksheet.findRow(60).getCell(3).value = parseInt(I210[0].count);
          const I211 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 95}]')`
          );
          worksheet.findRow(61).getCell(3).value = parseInt(I211[0].count);
          const I212 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 94}]')`
          );
          worksheet.findRow(62).getCell(3).value = parseInt(I212[0].count);
          const I213 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 92}]')`
          );
          worksheet.findRow(63).getCell(3).value = parseInt(I213[0].count);
          const I214 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 91}]')`
          );
          worksheet.findRow(64).getCell(3).value = parseInt(I214[0].count);
          const I215 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 89}]')`
          );
          worksheet.findRow(65).getCell(3).value = parseInt(I215[0].count);
          const I216 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 88}]')`
          );
          worksheet.findRow(66).getCell(3).value = parseInt(I216[0].count);
          const I217 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 87}]')`
          );
          worksheet.findRow(67).getCell(3).value = parseInt(I217[0].count);
          const I218 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 86}]')`
          );
          worksheet.findRow(68).getCell(3).value = parseInt(I218[0].count);
          const I219 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 85}]')`
          );
          worksheet.findRow(69).getCell(3).value = parseInt(I219[0].count);
          const I220 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 83}]')`
          );
          worksheet.findRow(70).getCell(3).value = parseInt(I220[0].count);
          const I221 = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 82}]')`
          );
          worksheet.findRow(71).getCell(3).value = parseInt(I221[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 80}]')`
          );
          worksheet.findRow(73).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 79}]')`
          );
          worksheet.findRow(74).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 77}]')`
          );
          worksheet.findRow(75).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 76}]')`
          );
          worksheet.findRow(76).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 75}]')`
          );
          worksheet.findRow(77).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 73}]')`
          );
          worksheet.findRow(78).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 72}]')`
          );
          worksheet.findRow(79).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 71}]')`
          );
          worksheet.findRow(80).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 69}]')`
          );
          worksheet.findRow(81).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 68}]')`
          );
          worksheet.findRow(82).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 67}]')`
          );
          worksheet.findRow(83).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 66}]')`
          );
          worksheet.findRow(84).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 65}]')`
          );
          worksheet.findRow(85).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 64}]')`
          );
          worksheet.findRow(86).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 63}]')`
          );
          worksheet.findRow(87).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 62}]')`
          );
          worksheet.findRow(88).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 61}]')`
          );
          worksheet.findRow(89).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 60}]')`
          );
          worksheet.findRow(90).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 59}]')`
          );
          worksheet.findRow(91).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 58}]')`
          );
          worksheet.findRow(92).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 252}]')`
          );
          worksheet.findRow(96).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 253}]')`
          );
          worksheet.findRow(97).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 256}]')`
          );
          worksheet.findRow(98).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 258}]')`
          );
          worksheet.findRow(99).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 260}]')`
          );
          worksheet.findRow(100).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 262}]')`
          );
          worksheet.findRow(101).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 264}]')`
          );
          worksheet.findRow(102).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 266}]')`
          );
          worksheet.findRow(103).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 268}]')`
          );
          worksheet.findRow(104).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 269}]')`
          );
          worksheet.findRow(105).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 270}]')`
          );
          worksheet.findRow(106).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 271}]')`
          );
          worksheet.findRow(107).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 274}]')`
          );
          worksheet.findRow(108).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 276}]')`
          );
          worksheet.findRow(109).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 278}]')`
          );
          worksheet.findRow(110).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 279}]')`
          );
          worksheet.findRow(111).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 280}]')`
          );
          worksheet.findRow(112).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 281}]')`
          );
          worksheet.findRow(113).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 282}]')`
          );
          worksheet.findRow(114).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 283}]')`
          );
          worksheet.findRow(115).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 284}]')`
          );
          worksheet.findRow(116).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 285}]')`
          );
          worksheet.findRow(117).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 286}]')`
          );
          worksheet.findRow(118).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 287}]')`
          );
          worksheet.findRow(119).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 288}]')`
          );
          worksheet.findRow(120).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 289}]')`
          );
          worksheet.findRow(121).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 290}]')`
          );
          worksheet.findRow(122).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 291}]')`
          );
          worksheet.findRow(123).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 292}]')`
          );
          worksheet.findRow(124).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 293}]')`
          );
          worksheet.findRow(125).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 294}]')`
          );
          worksheet.findRow(126).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 295}]')`
          );
          worksheet.findRow(127).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 296}]')`
          );
          worksheet.findRow(128).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 297}]')`
          );
          worksheet.findRow(129).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 298}]')`
          );
          worksheet.findRow(130).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 299}]')`
          );
          worksheet.findRow(131).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 300}]')`
          );
          worksheet.findRow(132).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 301}]')`
          );
          worksheet.findRow(133).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 302}]')`
          );
          worksheet.findRow(134).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 303}]')`
          );
          worksheet.findRow(135).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 304}]')`
          );
          worksheet.findRow(137).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 305}]')`
          );
          worksheet.findRow(138).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 306}]')`
          );
          worksheet.findRow(139).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 307}]')`
          );
          worksheet.findRow(140).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 308}]')`
          );
          worksheet.findRow(141).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 309}]')`
          );
          worksheet.findRow(142).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 310}]')`
          );
          worksheet.findRow(143).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 311}]')`
          );
          worksheet.findRow(144).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 312}]')`
          );
          worksheet.findRow(145).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 313}]')`
          );
          worksheet.findRow(146).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 314}]')`
          );
          worksheet.findRow(147).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 315}]')`
          );
          worksheet.findRow(148).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 316}]')`
          );
          worksheet.findRow(149).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 317}]')`
          );
          worksheet.findRow(150).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 318}]')`
          );
          worksheet.findRow(151).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 319}]')`
          );
          worksheet.findRow(152).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 320}]')`
          );
          worksheet.findRow(153).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 321}]')`
          );
          worksheet.findRow(154).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 322}]')`
          );
          worksheet.findRow(155).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 223}]')`
          );
          worksheet.findRow(156).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 324}]')`
          );
          worksheet.findRow(158).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 325}]')`
          );
          worksheet.findRow(159).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 326}]')`
          );
          worksheet.findRow(160).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 326}]')`
          );
          worksheet.findRow(161).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 328}]')`
          );
          worksheet.findRow(162).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 329}]')`
          );
          worksheet.findRow(163).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 330}]')`
          );
          worksheet.findRow(164).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 331}]')`
          );
          worksheet.findRow(165).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 332}]')`
          );
          worksheet.findRow(166).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 333}]')`
          );
          worksheet.findRow(167).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 334}]')`
          );
          worksheet.findRow(168).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 335}]')`
          );
          worksheet.findRow(169).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 336}]')`
          );
          worksheet.findRow(170).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 337}]')`
          );
          worksheet.findRow(171).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 338}]')`
          );
          worksheet.findRow(172).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 339}]')`
          );
          worksheet.findRow(173).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 340}]')`
          );
          worksheet.findRow(174).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 341}]')`
          );
          worksheet.findRow(175).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 342}]')`
          );
          worksheet.findRow(176).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
           from profiles
           where "createdAt" > '${start} 00:00:00'
             and "createdAt" < '${end} 23:59:59'
             and (prefers @> '[{"id": 343}]')`
          );
          worksheet.findRow(177).getCell(3).value = parseInt(a[0].count);
          return resolve(workbook.xlsx.writeBuffer());
        });
    })
  }

  #statistic02 = async (start: string, end: string) => {
    const year = new Date(start).getFullYear();
    const foundYear = await this.yearRepository.findOne({
      where: {
        year
      }
    });
    const yearId = foundYear?.id;
    if (!yearId) {
      throw new Error('Không tìm thấy thông tin năm');
    }
    const categories = await this.#loadCategories();
    const category = categories.find(e => e.name === 'Thương binh, người hưởng chính sách như thương binh, thương binh loại B');
    if (!category) {
      throw new Error('Không tìm thấy thông tin Thương binh, người hưởng chính sách như thương binh, thương binh loại B');
    }
    const workbook = new Workbook();
    await workbook.xlsx.readFile('./src/commons/templates/statistic-2.xlsx');
    const worksheet = workbook.getWorksheet("bieu-mau-2");
    let row = 9;
    const preferentials = (await this.preferentialRepository.find({
      where: {
        yearId,
        categoryId: category.id,
        status: true,
        subsidyForm: 1
      },
      relations: []
    })).filter(e=> e.name === 'Thương binh loại B' || e.name === 'Thương binh, người hưởng chính sách như thương binh');
    // row++;
    for (const preferential of preferentials) {
      const listProfiles = await this.listProfilesRepository
        .createQueryBuilder('lp')
        .select()
        .where('lp.prefers ::jsonb @> :prefers', {
          // startDate: `${start} 00:00:00`,
          // endDate: `${end} 23:59:59`,
          prefers: JSON.stringify([preferential.id])
        })
        .printSql()
        .getMany();
      const count = listProfiles.length;
      // Set tiêu đề
      worksheet.getCell(row, 2).value = preferential.name;
      // Set giá trị 
      worksheet.getCell(row, 3).value = count;
      // Set style
      worksheet.getCell(row, 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      worksheet.getCell(row, 2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      worksheet.getCell(row, 3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      // categoryTotal += count
      row++;
    }
    // // Set tiêu đề
    // worksheet.getCell(categoryRow, 2).value = category.name;
    // // Set total
    // worksheet.getCell(categoryRow, 3).value = categoryTotal;
    // // Set style
    // worksheet.getCell(categoryRow, 1).border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };
    // worksheet.getCell(categoryRow, 2).border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };
    // worksheet.getCell(categoryRow, 3).border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };
    return workbook.xlsx.writeBuffer();
  }

  BaoCaoSoLuongDoiTuongDangHuongTroCapUuDaiTrongGiaoDuc(start, end, doet_id) {
    const workbook = new Workbook();
    const manager = this.manager;
    return new Promise(function (resolve) {
      let a;
      workbook
        .xlsx
        .readFile(`./src/commons/templates/statistic-3.xlsx`)
        .then(async function () {
          const worksheet = workbook.getWorksheet("bieu-mau-3");
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(9).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(10).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(11).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(12).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(13).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(14).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(15).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(16).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(17).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(18).getCell(3).value = parseInt(a[0].count);
          a = await manager.query(
            `select count(*)
             from profiles
             where "createdAt" > '${start} 00:00:00'
               and "createdAt" < '${end} 23:59:59'
               and (prefers @> '[{"id": 130}]')`
          );
          worksheet.findRow(19).getCell(3).value = parseInt(a[0].count);
          return resolve(workbook.xlsx.writeBuffer());
        });
    });
  }
}
