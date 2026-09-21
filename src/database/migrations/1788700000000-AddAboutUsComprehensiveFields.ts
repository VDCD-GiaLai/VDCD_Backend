// src/database/migrations/1788700000000-AddAboutUsComprehensiveFields.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAboutUsComprehensiveFields1788700000000 implements MigrationInterface {
  name = 'AddAboutUsComprehensiveFields1788700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "short_name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "hotline" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "announcement" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "leader" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "stats_list" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "core_values_list" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "ecosystem_members" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "cta_section" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "cta_section"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "ecosystem_members"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "core_values_list"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "stats_list"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "leader"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "announcement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "hotline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN IF EXISTS "short_name"`,
    );
  }
}
