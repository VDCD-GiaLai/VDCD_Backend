// src/database/migrations/1788600000000-RefactorProjectContentToJsonb.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import { convertProjectToBlocks } from '../../modules/project/utils/project-to-blocks.util';
import { validateDocumentContent } from '../../common/validators/document-content.validator';

export class RefactorProjectContentToJsonb1788600000000 implements MigrationInterface {
  name = 'RefactorProjectContentToJsonb1788600000000';
  private readonly logger = new Logger('ProjectContentMigration');

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add backup column for 100% data preservation
    await queryRunner.query(
      `ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "content_html_backup" text`,
    );

    // 2. Add content column with compliant default value
    await queryRunner.query(
      `ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "content" jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}'`,
    );

    // 3. Query all existing records to migrate
    const projects = await queryRunner.query(
      `SELECT "id", "title", "overview", "challenge", "challenge_image", "challenge_image_file_id", "services", "transformation_before", "transformation_before_file_id", "transformation_after", "transformation_after_file_id", "technical_highlights" FROM "project"`,
    );

    const totalProjects = projects.length;
    let migrated = 0;
    const failed = 0;
    let emptyContent = 0;
    let htmlUnsupported = 0;
    let imagesMissing = 0;

    for (const p of projects) {
      // Analyze data before transformation
      const hasOverview = Boolean(p.overview && p.overview.trim().length > 0);
      const hasChallenge = Boolean(
        p.challenge && p.challenge.trim().length > 0,
      );
      if (!hasOverview && !hasChallenge) {
        emptyContent++;
      }

      // Check for dangerous or unsupported HTML tags
      const combinedText = `${p.overview || ''} ${p.challenge || ''}`;
      if (/<(script|iframe|object|embed|applet|style)/i.test(combinedText)) {
        htmlUnsupported++;
      }

      // Check for missing image references
      if (
        (p.challenge_image && !p.challenge_image.startsWith('http')) ||
        (p.transformation_before &&
          !p.transformation_before.startsWith('http')) ||
        (p.transformation_after && !p.transformation_after.startsWith('http'))
      ) {
        imagesMissing++;
      }

      // 100% Data Preservation Backup (JSON serialized snapshot of all legacy fields)
      const legacyBackup = JSON.stringify({
        overview: p.overview,
        challenge: p.challenge,
        challenge_image: p.challenge_image,
        challenge_image_file_id: p.challenge_image_file_id,
        services: p.services,
        transformation_before: p.transformation_before,
        transformation_before_file_id: p.transformation_before_file_id,
        transformation_after: p.transformation_after,
        transformation_after_file_id: p.transformation_after_file_id,
        technical_highlights: p.technical_highlights,
      });

      // Strict Conversion: Throws error immediately if validation fails (NO try/catch ignore)
      const doc = convertProjectToBlocks(p);
      validateDocumentContent(doc);

      await queryRunner.query(
        `UPDATE "project" SET "content" = $1, "content_html_backup" = $2 WHERE "id" = $3`,
        [JSON.stringify(doc), legacyBackup, p.id],
      );

      migrated++;
    }

    // 4. Print mandatory Migration Report
    const report = [
      '',
      '============================================================',
      '              PROJECT CONTENT MIGRATION REPORT              ',
      '============================================================',
      ` Total projects:       ${totalProjects}`,
      ` Migrated:             ${migrated}`,
      ` Failed:               ${failed}`,
      ` Empty content:        ${emptyContent}`,
      ` HTML unsupported:     ${htmlUnsupported}`,
      ` Images missing:       ${imagesMissing}`,
      '============================================================',
      '',
    ].join('\n');

    console.log(report);
    this.logger.log(report);

    // 5. Create performance GIN index on content
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_project_content_gin" ON "project" USING gin ("content")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop GIN index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_project_content_gin"`,
    );

    // 2. Drop content column
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN IF EXISTS "content"`,
    );

    // 3. Drop backup column
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN IF EXISTS "content_html_backup"`,
    );
  }
}
