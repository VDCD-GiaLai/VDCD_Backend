// src/database/migrations/1789100000000-AddOrderToArticle.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToArticle1789100000000 implements MigrationInterface {
  name = 'AddOrderToArticle1789100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add order column with default 0 safely
    await queryRunner.query(
      `ALTER TABLE "article" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0`,
    );

    // 2. Initialize existing articles with their current chronological order
    // so current display positions are 100% preserved
    await queryRunner.query(`
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY COALESCE("published_at", "created_at") DESC) as rn
        FROM "article"
      )
      UPDATE "article" a
      SET "order" = ranked.rn
      FROM ranked
      WHERE a.id = ranked.id AND a."order" = 0
    `);

    // 3. Clean up any trailing/leading slashes in existing article slugs
    await queryRunner.query(`
      UPDATE "article"
      SET "slug" = TRIM(BOTH '/' FROM TRIM("slug"))
      WHERE "slug" LIKE '/%' OR "slug" LIKE '%/'
    `);

    // 4. Create index for fast sorting by order and created_at
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_article_order" ON "article" ("order" ASC, "created_at" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_article_order"`);
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN IF EXISTS "order"`,
    );
  }
}

