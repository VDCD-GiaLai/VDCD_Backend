import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationAddress1785643075814 implements MigrationInterface {
  name = 'AddOrganizationAddress1785643075814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" ADD "address" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "address"`);
  }
}
