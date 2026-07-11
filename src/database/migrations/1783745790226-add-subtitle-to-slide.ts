import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubtitleToSlide1783745790226 implements MigrationInterface {
  name = 'AddSubtitleToSlide1783745790226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slide" ADD "subtitle" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slide" DROP COLUMN "subtitle"`);
  }
}
