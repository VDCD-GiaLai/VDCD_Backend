import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [UploadModule],
  providers: [CronjobService],
  exports: [CronjobService],
})
export class CronjobModule {}
