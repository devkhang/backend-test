import { Workbook } from "exceljs";
import * as moment from "moment";
import { EntityManager, getManager } from "typeorm";

export class ListSupportService {
  manager: EntityManager;

  constructor() {
    this.manager = getManager();
  }

  public async export(query) {
    let file: string;
    let form: number;
    switch (query.type) {
      case "1-time":
        file = "list-support-1-time.xlsx";
        form = 0;
        break;
      case "every-month":
        file = "list-support-every-month.xlsx";
        form = 1;
        break;
      case "every-year":
        file = "list-support-every-year.xlsx";
        form = 2;
        break;
    }
    const lists = await this.manager.query(
      `select profiles, code
       from lists
       where id = ${query.id} limit 1`
    );
    const manager = this.manager;
    const workbook = new Workbook();
    return new Promise(function(resolve) {
      workbook.xlsx.readFile(`./src/commons/templates/${file}`).then(async function() {
        if (lists.length !== 0) {
          const worksheet = workbook.getWorksheet("Sheet1");
          const profiles = lists[0].profiles;
          const rowStart = 9;
          let index = 0;
          const dateCode = moment(lists[0].code, 'MM/YYYY');
          worksheet.findRow(4).getCell(1).value = dateCode.format('[Tháng] DD [nằm] YYYY');
          for (const profile of profiles) {
            if (profile.isCheck) {
              const _profile = await manager.query(`select "nativePlace", code from profiles where id = ${profile.id} limit 1`);
              worksheet.insertRow(rowStart + index, [
                (index + 1).toString(),
                profile.name,
                moment(profile.dateOfBirth).format('DD/MM/YYYY'),
                _profile[0].nativePlace,
                _profile[0].code,
                '',
                profile.allowance,
              ]);
              worksheet.findRow(rowStart + index).getCell(1).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(2).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(3).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(4).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(5).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(6).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(7).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(8).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              worksheet.findRow(rowStart + index).getCell(9).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
              };
              index++;
            }
          }
        }
        return resolve(workbook.xlsx.writeBuffer());
      });
    });
  }
}
