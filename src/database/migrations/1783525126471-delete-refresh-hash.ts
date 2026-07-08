import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteRefreshHash1783525126471 implements MigrationInterface {
  name = 'DeleteRefreshHash1783525126471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_user" DROP COLUMN "refresh_token_hash"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_user" ADD "refresh_token_hash" character varying`,
    );
  }
}
