import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileIdColumns1783771165183 implements MigrationInterface {
  name = 'AddFileIdColumns1783771165183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_image" ADD "file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "thumbnail_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ADD "thumbnail_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ADD "thumbnail_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD "thumbnail_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner" ADD "logo_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "slide" ADD "image_file_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slide" DROP COLUMN "image_file_id"`);
    await queryRunner.query(`ALTER TABLE "partner" DROP COLUMN "logo_file_id"`);
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN "thumbnail_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" DROP COLUMN "thumbnail_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" DROP COLUMN "thumbnail_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "thumbnail_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_image" DROP COLUMN "file_id"`,
    );
  }
}
