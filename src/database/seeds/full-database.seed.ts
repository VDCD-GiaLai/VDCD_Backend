// src/database/seeds/full-database.seed.ts
/**
 * VDCD Full Database Seeding Script (Independent)
 * Generated at: 2026-09-03T16:01:24.201Z
 * Total tables: 16 | Total records: 183
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
const env = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); // fallback

import { AdminUser } from '../../modules/admin-user/entities/admin-user.entity';
import { Organization } from '../../modules/organization/entities/organization.entity';
import { OperationField } from '../../modules/operation-field/entities/operation-field.entity';
import { Province } from '../../modules/province/entities/province.entity';
import { Slide } from '../../modules/slide/entities/slide.entity';
import { Program } from '../../modules/program/entities/program.entity';
import { Solution } from '../../modules/solution/entities/solution.entity';
import { Project } from '../../modules/project/entities/project.entity';
import { ProjectImage } from '../../modules/project/entities/project-image.entity';
import { Article } from '../../modules/article/entities/article.entity';
import { Job } from '../../modules/job/entities/job.entity';
import { UploadTemp } from '../../modules/upload/entities/upload-temp.entity';
import { Lead } from '../../modules/lead/entities/lead.entity';
import { Partner } from '../../modules/partner/entities/partner.entity';
import { PageBanner } from '../../modules/page-banner/entities/page-banner.entity';
import { SlideDetailBlog } from '../../modules/slide-detail-blog/entities/slide-detail-blog.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    AdminUser,
    Organization,
    OperationField,
    Province,
    Partner,
    Slide,
    PageBanner,
    Program,
    Solution,
    Project,
    ProjectImage,
    Article,
    Job,
    UploadTemp,
    Lead,
    SlideDetailBlog,
  ],
  synchronize: false,
});

async function run() {
  console.log('🌱 Starting Full Database Seeding...');
  console.log(
    `📡 Connecting to ${process.env.DB_NAME} at ${process.env.DB_HOST}...`,
  );

  await AppDataSource.initialize();
  console.log('✅ Connected to database successfully.');

  const sqlFilePath = path.join(__dirname, 'full-database-seed.sql');
  if (!fs.existsSync(sqlFilePath)) {
    throw new Error(`Cannot find SQL seed file at: ${sqlFilePath}`);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  console.log('🚀 Executing full-database-seed.sql transaction...');
  const startTime = Date.now();

  try {
    await queryRunner.query(sqlContent);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Successfully seeded full database in ${elapsed}s!`);
    console.log('📊 Summary:');
    console.log('   - admin_user          : 3 rows');
    console.log('   - organization        : 1 rows');
    console.log('   - operation_field     : 6 rows');
    console.log('   - province            : 14 rows');
    console.log('   - partner             : 22 rows');
    console.log('   - job                 : 6 rows');
    console.log('   - lead                : 8 rows');
    console.log('   - contact             : 0 rows');
    console.log('   - page_banner         : 7 rows');
    console.log('   - slide               : 5 rows');
    console.log('   - program             : 11 rows');
    console.log('   - solution            : 19 rows');
    console.log('   - project             : 16 rows');
    console.log('   - slide_detail_blog   : 1 rows');
    console.log('   - project_image       : 54 rows');
    console.log('   - article             : 10 rows');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

run()
  .then(() => {
    console.log('🎉 Full database seeding completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Fatal error during seeding:', err);
    process.exit(1);
  });
