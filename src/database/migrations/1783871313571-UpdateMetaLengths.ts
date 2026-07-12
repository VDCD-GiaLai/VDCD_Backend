import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMetaLengths1783871313571 implements MigrationInterface {
  name = 'UpdateMetaLengths1783871313571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "meta_title" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "meta_description" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ALTER COLUMN "meta_title" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ALTER COLUMN "meta_description" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ALTER COLUMN "meta_title" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ALTER COLUMN "meta_description" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "meta_title" TYPE character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "meta_description" TYPE character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "meta_title" TYPE character varying(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "meta_description" TYPE character varying(160)`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ALTER COLUMN "meta_title" TYPE character varying(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ALTER COLUMN "meta_description" TYPE character varying(160)`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ALTER COLUMN "meta_title" TYPE character varying(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ALTER COLUMN "meta_description" TYPE character varying(160)`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "meta_title" TYPE character varying(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ALTER COLUMN "meta_description" TYPE character varying(160)`,
    );
  }
}
