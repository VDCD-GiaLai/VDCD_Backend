import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RedisService } from '../redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Check system health status',
    description:
      'Checks database connectivity, server uptime, and returns overall system status.',
  })
  @ApiResponse({
    status: 200,
    description: 'System health status retrieved successfully.',
  })
  async check() {
    const dbOk = this.dataSource.isInitialized;

    let redisOk = false;
    try {
      await this.redisService.getClient().ping();
      redisOk = true;
    } catch {
      redisOk = false;
    }

    const allOk = dbOk && redisOk;

    return {
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services: {
        database: dbOk ? 'connected' : 'disconnected',
        redis: redisOk ? 'connected' : 'disconnected',
      },
    };
  }
}
