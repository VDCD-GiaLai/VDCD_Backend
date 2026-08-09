import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { BackupModule } from '../backup/backup.module';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [UploadModule, BackupModule],
  providers: [CronjobService],
  exports: [CronjobService],
})
export class CronjobModule {}
