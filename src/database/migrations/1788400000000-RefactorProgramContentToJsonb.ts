// src/database/migrations/1788400000000-RefactorProgramContentToJsonb.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { convertProgramHtmlToBlocks } from '../../modules/program/utils/html-to-blocks.util';
import { validateDocumentContent } from '../../common/validators/document-content.validator';

export class RefactorProgramContentToJsonb1788400000000 implements MigrationInterface {
  name = 'RefactorProgramContentToJsonb1788400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add published_at column
    await queryRunner.query(
      `ALTER TABLE "program" ADD "published_at" TIMESTAMP`,
    );

    // 2. Add backup column and copy all legacy HTML content for 100% data preservation
    await queryRunner.query(
      `ALTER TABLE "program" ADD "content_html_backup" text`,
    );
    await queryRunner.query(
      `UPDATE "program" SET "content_html_backup" = "content"`,
    );

    // 3. Set published_at = created_at for already-published records
    await queryRunner.query(
      `UPDATE "program" SET "published_at" = "created_at" WHERE "is_published" = true`,
    );

    // 4. Add temporary jsonb column with compliant default value
    await queryRunner.query(
      `ALTER TABLE "program" ADD "content_jsonb" jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}'`,
    );

    // 5. Query all existing records and convert legacy HTML to block documents
    const programs = await queryRunner.query(
      `SELECT "id", "content" FROM "program" WHERE "content" IS NOT NULL`,
    );

    for (const p of programs) {
      const doc = convertProgramHtmlToBlocks(p.content);
      // Validate the converted document against schema rules
      validateDocumentContent(doc);
      await queryRunner.query(
        `UPDATE "program" SET "content_jsonb" = $1 WHERE "id" = $2`,
        [JSON.stringify(doc), p.id],
      );
    }

    // 6. Drop legacy text column and rename jsonb column to content
    await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "program" RENAME COLUMN "content_jsonb" TO "content"`,
    );

    // 7. Create performance indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_program_published_at" ON "program" ("published_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_program_is_published" ON "program" ("is_published")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_program_field_id" ON "program" ("field_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_program_field_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_program_is_published"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_program_published_at"`,
    );

    // 2. Restore content from HTML backup
    await queryRunner.query(`ALTER TABLE "program" ADD "content_text" text`);
    await queryRunner.query(
      `UPDATE "program" SET "content_text" = "content_html_backup"`,
    );
    await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "program" RENAME COLUMN "content_text" TO "content"`,
    );

    // 3. Drop backup and published_at columns
    await queryRunner.query(
      `ALTER TABLE "program" DROP COLUMN "content_html_backup"`,
    );
    await queryRunner.query(`ALTER TABLE "program" DROP COLUMN "published_at"`);
  }
}
