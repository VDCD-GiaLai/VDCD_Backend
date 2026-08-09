/**
 * Manual backup test script.
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/test-backup.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { BackupService } from '../modules/backup/backup.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const backupService = app.get(BackupService);

  console.log('\n🚀 Running manual backup test...\n');
  const result = await backupService.runBackup();
  console.log('\n📋 Result:', JSON.stringify(result, null, 2));

  await app.close();
  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
