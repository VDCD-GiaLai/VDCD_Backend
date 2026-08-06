import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAboutUsFields1786027792893 implements MigrationInterface {
  name = 'AddAboutUsFields1786027792893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "business_license_no" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "operation_fields" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "ecosystem_capabilities" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "development_orientations" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "development_orientations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "ecosystem_capabilities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "operation_fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "business_license_no"`,
    );
  }
}
