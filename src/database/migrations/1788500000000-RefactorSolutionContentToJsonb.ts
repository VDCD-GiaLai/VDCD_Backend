// src/database/migrations/1788500000000-RefactorSolutionContentToJsonb.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { convertSolutionHtmlToBlocks } from '../../modules/solution/utils/html-to-blocks.util';
import { validateDocumentContent } from '../../common/validators/document-content.validator';

export class RefactorSolutionContentToJsonb1788500000000 implements MigrationInterface {
  name = 'RefactorSolutionContentToJsonb1788500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add published_at column
    await queryRunner.query(
      `ALTER TABLE "solution" ADD "published_at" TIMESTAMP`,
    );

    // 2. Add backup column and copy all legacy HTML content for 100% data preservation
    await queryRunner.query(
      `ALTER TABLE "solution" ADD "content_html_backup" text`,
    );
    await queryRunner.query(
      `UPDATE "solution" SET "content_html_backup" = "content"`,
    );

    // 3. Set published_at = created_at for already-published records
    await queryRunner.query(
      `UPDATE "solution" SET "published_at" = "created_at" WHERE "is_published" = true`,
    );

    // 4. Add temporary jsonb column with compliant default value
    await queryRunner.query(
      `ALTER TABLE "solution" ADD "content_jsonb" jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}'`,
    );

    // 5. Query all existing records and convert legacy content to block documents
    const solutions = await queryRunner.query(
      `SELECT "id", "content" FROM "solution" WHERE "content" IS NOT NULL`,
    );

    for (const s of solutions) {
      const doc = convertSolutionHtmlToBlocks(s.content);
      // Validate the converted document against schema rules
      validateDocumentContent(doc);
      await queryRunner.query(
        `UPDATE "solution" SET "content_jsonb" = $1 WHERE "id" = $2`,
        [JSON.stringify(doc), s.id],
      );
    }

    // 6. Drop legacy text column and rename jsonb column to content
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "solution" RENAME COLUMN "content_jsonb" TO "content"`,
    );

    // 7. Create performance indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_solution_published_at" ON "solution" ("published_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_solution_is_published" ON "solution" ("is_published")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_solution_field_id" ON "solution" ("field_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_solution_field_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_solution_is_published"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_solution_published_at"`,
    );

    // 2. Restore content from HTML backup
    await queryRunner.query(`ALTER TABLE "solution" ADD "content_text" text`);
    await queryRunner.query(
      `UPDATE "solution" SET "content_text" = "content_html_backup"`,
    );
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "solution" RENAME COLUMN "content_text" TO "content"`,
    );

    // 3. Drop backup and published_at columns
    await queryRunner.query(
      `ALTER TABLE "solution" DROP COLUMN "content_html_backup"`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" DROP COLUMN "published_at"`,
    );
  }
}
