import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectDetailFields1785671319054 implements MigrationInterface {
  name = 'AddProjectDetailFields1785671319054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_image" ADD "size" character varying NOT NULL DEFAULT 'small'`,
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "challenge" text`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "challenge_image" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "challenge_image_file_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "services" text`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "discipline" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "transformation_before" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "transformation_before_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "transformation_after" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "transformation_after_file_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "technical_highlights" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "next_project_slug" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "next_project_slug"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "technical_highlights"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "transformation_after_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "transformation_after"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "transformation_before_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "transformation_before"`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "discipline"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "services"`);
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "challenge_image_file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "challenge_image"`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "challenge"`);
    await queryRunner.query(`ALTER TABLE "project_image" DROP COLUMN "size"`);
  }
}
