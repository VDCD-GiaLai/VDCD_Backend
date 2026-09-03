import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1785342417426 implements MigrationInterface {
  name = 'UpdateSchema1785342417426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solution" ADD IF NOT EXISTS "website_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "solution" DROP COLUMN IF EXISTS "website_url"`,
    );
  }
}
