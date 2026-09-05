// src/modules/solution/scripts/run-solution-migration.ts
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { convertSolutionHtmlWithReport } from '../utils/html-to-blocks.util';
import { validateDocumentContent } from '../../../common/validators/document-content.validator';

// 1. Load environment variables
const envPath = path.resolve(__dirname, '../../../../.env.development');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

export interface Phase10Report {
  totalSolutions: number;
  solutionsWithContent: number;
  solutionsWithoutContent: number;
  totalHeadings: {
    total: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  totalParagraphs: number;
  totalLists: number;
  totalOrderedLists: number;
  totalNestedLists: number;
  totalImages: number;
  totalQuotes: number;
  totalCtas: number;
  unsupportedTags: string[];
  warnings: Array<{ id: string; slug: string; warning: string }>;
  backupFilePath: string;
}

export async function runSolutionMigration(): Promise<Phase10Report> {
  const client = new Client({
    host: envConfig.DB_HOST,
    port: Number(envConfig.DB_PORT || 5432),
    user: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
  });

  await client.connect();
  console.log('✅ [MIGRATION] Connected to PostgreSQL database.');

  // 2. Fetch all solutions
  const res = await client.query(`
    SELECT id, title, slug, short_description, content_html_backup, content,
           thumbnail, thumbnail_file_id, website_url, field_id,
           meta_title, meta_description, is_published, published_at,
           created_at, updated_at
    FROM solution
    ORDER BY created_at ASC
  `);

  const solutions = res.rows;
  console.log(`📊 [MIGRATION] Found ${solutions.length} solutions to process.`);

  // 3. Create pre-migration backup
  const backupDir = path.resolve(__dirname, '../../../../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = path.join(
    backupDir,
    `solution_backup_${timestamp}.json`,
  );
  fs.writeFileSync(backupFilePath, JSON.stringify(solutions, null, 2), 'utf-8');
  console.log(
    `💾 [MIGRATION] Pre-migration backup saved to: ${backupFilePath}`,
  );

  // 4. Initialize report aggregation
  const report: Phase10Report = {
    totalSolutions: solutions.length,
    solutionsWithContent: 0,
    solutionsWithoutContent: 0,
    totalHeadings: { total: 0, h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
    totalParagraphs: 0,
    totalLists: 0,
    totalOrderedLists: 0,
    totalNestedLists: 0,
    totalImages: 0,
    totalQuotes: 0,
    totalCtas: 0,
    unsupportedTags: [],
    warnings: [],
    backupFilePath,
  };

  // 5. Migrate each solution
  for (const row of solutions) {
    const rawContent: string | null =
      row.content_html_backup ||
      (typeof row.content === 'string' ? row.content : null);

    if (!rawContent || !rawContent.trim()) {
      report.solutionsWithoutContent++;
      // Save empty valid document
      const emptyDoc = { version: 1, blocks: [] };
      await client.query('UPDATE solution SET content = $1 WHERE id = $2', [
        JSON.stringify(emptyDoc),
        row.id,
      ]);
      continue;
    }

    report.solutionsWithContent++;

    // Convert with detailed report
    const { document, stats, warnings } = convertSolutionHtmlWithReport(
      rawContent,
      {
        title: row.title,
        slug: row.slug,
      },
    );

    // Validate generated document
    validateDocumentContent(document);

    // Update database
    await client.query('UPDATE solution SET content = $1 WHERE id = $2', [
      JSON.stringify(document),
      row.id,
    ]);

    // Aggregate statistics
    report.totalHeadings.total += stats.headings.total;
    report.totalHeadings.h1 += stats.headings.h1;
    report.totalHeadings.h2 += stats.headings.h2;
    report.totalHeadings.h3 += stats.headings.h3;
    report.totalHeadings.h4 += stats.headings.h4;
    report.totalHeadings.h5 += stats.headings.h5;
    report.totalHeadings.h6 += stats.headings.h6;
    report.totalParagraphs += stats.paragraphs;
    report.totalLists += stats.lists;
    report.totalOrderedLists += stats.orderedLists;
    report.totalNestedLists += stats.nestedLists;
    report.totalImages += stats.images;
    report.totalQuotes += stats.quotes;
    report.totalCtas += stats.ctas;

    for (const tag of stats.unsupportedTags) {
      if (!report.unsupportedTags.includes(tag)) {
        report.unsupportedTags.push(tag);
      }
    }

    for (const w of warnings) {
      report.warnings.push({
        id: row.id,
        slug: row.slug,
        warning: w,
      });
    }
  }

  await client.end();
  console.log('🎉 [MIGRATION] Migration complete. All solutions updated.');

  return report;
}

if (require.main === module) {
  runSolutionMigration()
    .then((report) => {
      console.log(
        '\n================ PHASE 10 MIGRATION REPORT ================',
      );
      console.log(`Total Solutions: ${report.totalSolutions}`);
      console.log(`With Content: ${report.solutionsWithContent}`);
      console.log(`Without Content: ${report.solutionsWithoutContent}`);
      console.log(`Headings: ${report.totalHeadings.total}`);
      console.log(`Paragraphs: ${report.totalParagraphs}`);
      console.log(`Lists (Unordered): ${report.totalLists}`);
      console.log(`Lists (Ordered): ${report.totalOrderedLists}`);
      console.log(`Nested Lists: ${report.totalNestedLists}`);
      console.log(`Images: ${report.totalImages}`);
      console.log(`Quotes: ${report.totalQuotes}`);
      console.log(`CTAs: ${report.totalCtas}`);
      console.log(
        `Unsupported Tags: ${report.unsupportedTags.join(', ') || '(none)'}`,
      );
      console.log(`Total Warnings: ${report.warnings.length}`);
      console.log(`Backup: ${report.backupFilePath}`);
      console.log(
        '==========================================================\n',
      );
    })
    .catch((err) => {
      console.error('❌ [MIGRATION FAILED]', err);
      process.exit(1);
    });
}
