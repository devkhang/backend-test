import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
export class ethnic1635390919190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let queries = fs
      .readFileSync(join(__dirname, '../sql/ethnic.sql'))
      .toString();
    await queryRunner.query(queries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            delete from ethnic;
        `);
  }
}
