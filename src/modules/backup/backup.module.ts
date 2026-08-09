import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleDriveConfig from '../../config/google-drive.config';
import { BackupService } from './backup.service';

@Module({
  imports: [ConfigModule.forFeature(googleDriveConfig)],
  providers: [BackupService],
  exports: [BackupService],
})
export class BackupModule {}
