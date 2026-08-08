import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobLeadFields1786056000000 implements MigrationInterface {
  name = 'AddJobLeadFields1786056000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Job: experience + tags ──
    await queryRunner.query(
      `ALTER TABLE "job" ADD "experience" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "job" ADD "tags" jsonb`);

    // ── Lead: 7 new columns ──
    await queryRunner.query(`ALTER TABLE "lead" ADD "dob" date`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "address" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "experience_years" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "expected_salary" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "portfolio_url" character varying(500)`,
    );
    await queryRunner.query(`ALTER TABLE "lead" ADD "cover_letter" text`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "source" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "cover_letter"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "portfolio_url"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "expected_salary"`);
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "experience_years"`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "dob"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "experience"`);
  }
}
