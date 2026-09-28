// src/database/migrations/1789000000000-AddOrderToProgram.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToProgram1789000000000 implements MigrationInterface {
  name = 'AddOrderToProgram1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add order column with default 0 safely
    await queryRunner.query(
      `ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0`,
    );

    // 2. Initialize existing programs with their current chronological order
    // so current display positions are 100% preserved
    await queryRunner.query(`
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "created_at" DESC) as rn
        FROM "program"
      )
      UPDATE "program" p
      SET "order" = ranked.rn
      FROM ranked
      WHERE p.id = ranked.id
    `);

    // 3. Create index for fast sorting by order and created_at
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_program_order" ON "program" ("order" ASC, "created_at" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_program_order"`);
    await queryRunner.query(
      `ALTER TABLE "program" DROP COLUMN IF EXISTS "order"`,
    );
  }
}
