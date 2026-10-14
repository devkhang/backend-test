import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
export class preferentials2208222082208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let queries = fs
      .readFileSync(join(__dirname, '../sql/categories.sql'))
      .toString();
    await queryRunner.query(queries);
    queries = fs
      .readFileSync(join(__dirname, '../sql/preferentials.sql'))
      .toString();
    await queryRunner.query(queries);
    queries = fs
      .readFileSync(join(__dirname, '../sql/years.sql'))
      .toString();
    await queryRunner.query(queries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }
}
