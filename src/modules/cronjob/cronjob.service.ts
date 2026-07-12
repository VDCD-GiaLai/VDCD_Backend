import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  constructor(private readonly uploadService: UploadService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanOrphanFiles(): Promise<void> {
    this.logger.log('Starting scheduled cleanup of orphan files...');
    try {
      await this.uploadService.cleanOrphanFiles();
      this.logger.log(
        'Scheduled cleanup of orphan files completed successfully.',
      );
    } catch (error) {
      this.logger.error(
        'Error occurred during scheduled cleanup of orphan files:',
        error,
      );
    }
  }
}
