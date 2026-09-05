// src/database/migrations/1788300000000-RefactorArticleContentToJsonb.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { convertHtmlToBlocks } from '../../modules/article/utils/html-to-blocks.util';
import { validateDocumentContent } from '../../common/validators/document-content.validator';

export class RefactorArticleContentToJsonb1788300000000 implements MigrationInterface {
  name = 'RefactorArticleContentToJsonb1788300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add new metadata columns
    await queryRunner.query(`ALTER TABLE "article" ADD "subtitle" text`);
    await queryRunner.query(`ALTER TABLE "article" ADD "excerpt" text`);

    // 2. Add backup column and copy all legacy HTML content for 100% data preservation
    await queryRunner.query(
      `ALTER TABLE "article" ADD "content_html_backup" text`,
    );
    await queryRunner.query(
      `UPDATE "article" SET "content_html_backup" = "content"`,
    );

    // 3. Add temporary jsonb column with compliant default value
    await queryRunner.query(
      `ALTER TABLE "article" ADD "content_jsonb" jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}'`,
    );

    // 4. Query all existing records and convert legacy HTML to block documents
    const articles = await queryRunner.query(
      `SELECT "id", "content" FROM "article" WHERE "content" IS NOT NULL`,
    );

    for (const a of articles) {
      const doc = convertHtmlToBlocks(a.content);
      // Validate the converted document against schema rules
      validateDocumentContent(doc);
      await queryRunner.query(
        `UPDATE "article" SET "content_jsonb" = $1 WHERE "id" = $2`,
        [JSON.stringify(doc), a.id],
      );
    }

    // 5. Drop legacy text column and rename jsonb column to content
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "article" RENAME COLUMN "content_jsonb" TO "content"`,
    );

    // 6. Create performance indexes (Note: slug already has unique index)
    await queryRunner.query(
      `CREATE INDEX "IDX_article_published_at" ON "article" ("published_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_is_published" ON "article" ("is_published")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_project_id" ON "article" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_program_id" ON "article" ("program_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_solution_id" ON "article" ("solution_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_article_category" ON "article" ("category")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_category"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_solution_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_program_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_project_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_is_published"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_article_published_at"`,
    );

    // 2. Restore content from HTML backup
    await queryRunner.query(`ALTER TABLE "article" ADD "content_text" text`);
    await queryRunner.query(
      `UPDATE "article" SET "content_text" = "content_html_backup"`,
    );
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "article" RENAME COLUMN "content_text" TO "content"`,
    );

    // 3. Drop backup and new columns
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN "content_html_backup"`,
    );
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "subtitle"`);
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "excerpt"`);
  }
}
